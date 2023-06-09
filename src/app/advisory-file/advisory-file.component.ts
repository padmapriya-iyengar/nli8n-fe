import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UtilityService } from 'src/app/commons/utilities.service';
import { ADVISORY_FILE } from 'src/app/entities/advisory-file';
import * as _ from "lodash";
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AppService } from '../commons/app.service';

@Component({
  selector: 'advisory-file',
  templateUrl: './advisory-file.component.html',
  styleUrls: ['./advisory-file.component.scss']
})
export class AdvisoryFileComponent implements OnInit, OnChanges{
  constructor(private utilService: UtilityService, 
    private route: ActivatedRoute, private datePipe: DatePipe,
    private appService: AppService) { }

  fileDetails: any[] = [];
  advisoryFile!: ADVISORY_FILE;
  readOnly: boolean = false;
  secClassification: any[] = [];
  allFileDivisions: any[] = [];
  fileDivisions: any[] = [];
  header1: any[]=[];
  header2: any[]=[];
  year: any[]=[];
  localAgencyNames: any[]=[];
  localAgencyTypes: any[]=[];
  foreignAgencyNames: any[]=[];
  foreignAgencyTypes: any[]=[];
  fileOrigin: any[]=[];
  fileOwners: any[]=[];
  caseStatus: any[]=[];
  todaysDate: Date = new Date();
  agcFileReFNo: string='';
  fileSerialNumber:number=0;
  @ViewChild('advfileForm') advfileForm!: NgForm;
  formSubmitted: boolean = false;
  @Input() modalSubmit: boolean = false;
  @Output() reqSubmit = new EventEmitter<any>();
  alertMessages: any[]=[];
  showForeignAgencyDetails: boolean = false;
  showLocalAgencyDetails: boolean = true;
  foreignCountries: any[]=[];
  fileDivisionItemIDMap: Map<string, string> = new Map<string, string>();
  fileHeader1ItemIDMap: Map<string, string> = new Map<string, string>();
  fileHeader2ItemIDMap: Map<string, string> = new Map<string, string>();
  localAgencyTypeCodeIDMap: Map<string, string> = new Map<string, string>();
  foreignAgencyTypeCodeIDMap: Map<string, string> = new Map<string, string>();
  foreignAgencyCountryCodeIDMap: Map<string, string> = new Map<string, string>();
  requestNumber!: string | null;
  showSpinner: boolean = false;
  reqIDAvailable: boolean = false;

  ngOnInit(): void {
    this.showSpinner = true;
    this.formSubmitted = false;
    this.advisoryFile = new ADVISORY_FILE();
    this.setSerialNo();
    this.getFileOrigins();
    this.getSecurityClassifications();
    this.getAGItemID()
    this.getFileOwners();
    this.getCaseStatus();
    this.advisoryFile.FileType = 'ADVISORY';
  }
  ngOnChanges(changes: SimpleChanges) {
      if (changes['modalSubmit'].currentValue){
        this.onSubmit()
      }
  }
  setSerialNo(){
    this.showSpinner = true;
    this.appService.getSequence('Advisory File').subscribe({next: (response) => {
      let resp = Object.assign(response)
      let prefix = resp[0].prefix?resp[0].prefix:''
      let count = Number(resp[0].seq_count)+1
      let suffix = resp[0].suffix?resp[0].suffix:''
      this.advisoryFile.I_SerialNo = prefix + count + suffix;
    },
    error: (error) => {
      console.error("Request failed with error")
      this.showSpinner = false;
    }})
  }
  getFileOrigins() {
    this.fileOrigin = [];
    this.showSpinner = true;
    this.appService.getMasterDataByType('FILE_ORIGIN').subscribe({next: (response) => {
        let resp = Object.assign(response)
        if(resp){
          if(resp.length){
            resp.forEach((item:any) => {
              this.fileOrigin.push({ label: item.value, value: item.code })
            })
          }
          this.advisoryFile.LocalForeign = 'ADDR_L';
          this.advisoryFile.LocalOrForeign = 'ADDR_L';
          this.getLocalAgencyTypes();
          this.showSpinner = false;
        }
      },
      error: (error) => {
        console.error('Request failed with error')
        this.showSpinner = false;
      }
    })
  }
  getSecurityClassifications(){
    this.secClassification = [];
    this.showSpinner = true;
    this.appService.getMasterDataByType('SECURITY_CLASSIFICATION').subscribe({next: (response) => {
      let resp = Object.assign(response);
      if(resp){
        if(resp.length){
          resp.forEach((item:any) => {
            this.secClassification.push({ label: item.value, value: item.code })
          })
        }
        this.advisoryFile.SecurityClassification = 'SCLASS_S';
        this.showSpinner = false;
      }
    },
    error: (error) => {
      console.log('Request failed with error')
      this.showSpinner = false;
    }
    })
  }
  getCaseStatus() {
    this.caseStatus = [];
    this.showSpinner = true;
    this.appService.getMasterDataByType('CASE_STATUS').subscribe({next: (response) => {
      let resp = Object.assign(response);
      if(resp){
        if(resp.length){
          resp.forEach((item:any) => {
            this.caseStatus.push({ label: item.value, value: item.code })
          })
        }
        this.showSpinner = false;
      }
        this.advisoryFile.FileStatus = 'CSTAT_DO'
    },
    error: (error) => {
      console.log('Request failed with error');
      this.showSpinner = false;
    }
  })
  }
  getAGItemID() {
    this.showSpinner = true;
    this.appService.getMasterDataByType('ROOT_CODE').subscribe({next: (response) => {
      let resp = Object.assign(response)
      if(resp){
        this.getFileDivisions(resp[0].code)
        this.showSpinner = false;
      }
    },
    error: (error) => {
      console.log('Request failed with error');
      this.showSpinner = false;
    }
  })
  }
  getFileDivisions(agItemID: string) {
    this.allFileDivisions = [];
    this.showSpinner = true;
    this.appService.getMasterDataByTypeAndParent('FILE_DIVISION', agItemID).subscribe({next: (response) => {
      let resp = Object.assign(response)
      if(resp){
        if(resp.length){
          resp.forEach((item:any) => {
            this.allFileDivisions.push({ label: item.value, value: item.code })
            this.fileDivisionItemIDMap.set(item.value, item.code)
          })
        }
        this.getCurrentUserFileDivisions();
        this.showSpinner = false;
      }
    },
    error: (error) => {
      console.log('Request failed with error')
      this.showSpinner = false;
    }
  })
  }
  getCurrentUserFileDivisions() {
    this.fileDivisions = [];
    this.showSpinner = true;
    this.appService.getUserDivisions(UtilityService.CURRENT_USER_NAME).subscribe({next: (response) => {
      let resp = Object.assign(response)
      if(resp){
        if(resp.length){
          resp.forEach((item:any) => {
            let index = _.findIndex(this.allFileDivisions, function (fg: any) { return fg.value == item.title; })
            if (index != -1) {
              this.fileDivisions.push({ label: item.group_name, value: item.title })
            }
          })
        }
        this.showSpinner = false;
      }
    },
    error: (error) => {
      console.log('Request failed with error');
      this.showSpinner = false;
    }
  })
  }
  getFileHeader1(divItemID: string) {
    this.header1 = []
    this.showSpinner = true;
    this.appService.getMasterDataByTypeAndParent('FILE_HEADER1',divItemID).subscribe({next: (response) => {
      let resp = Object.assign(response);
      if(resp){
        if(resp.length){
          resp.forEach((item:any) => {
            this.header1.push({ label: item.value, value: item.code })
            this.fileHeader1ItemIDMap.set(item.code, item.code)
          })
        }
        this.showSpinner = false;
      }
    },
    error: (error) => {
      console.log('Request failed with error');
      this.showSpinner = false;
    }
  })
  }
  getFileHeader2(header1ItemID: string) {
    this.header2 = []
    this.showSpinner = true;
    this.appService.getMasterDataByTypeAndParent('FILE_HEADER2',header1ItemID).subscribe({next: (response) => {
      let resp = Object.assign(response);
      if(resp){
        if(resp.length){
          resp.forEach((item:any) => {
            this.header2.push({ label: item.value, value: item.code })
            this.fileHeader2ItemIDMap.set(item.code, item.code)
          })
        }
        this.showSpinner = false;
      }
    },
    error: (error) => {
      console.log('Request failed with error');
      this.showSpinner = false;
    }
  })
  }
  getFileYear() {
    this.year = []
    this.showSpinner = true;
    this.appService.getMasterDataByType('FILE_YEAR').subscribe({next: (response) => {
      let resp = Object.assign(response);
      if(resp){
        if(resp.length){
          resp.forEach((item:any) => {
            this.year.push({ label: item.value, value: item.code })
          })
        }
        this.showSpinner = false;
      }
    },
    error: (error) => {
      console.log('Request failed with error');
      this.showSpinner = false;
    }
  })
  }
  getLocalAgencyTypes() {
    this.localAgencyTypes = [];
    this.showSpinner = true;
    this.appService.getMasterDataByType('EXTERNAL_AGENCY_TYPE').subscribe({next: (response) => {
      let resp = Object.assign(response);
      if(resp){
        if(resp.length){
          resp.forEach((item:any) => {
            this.localAgencyTypes.push({ label: item.value, value: item.code })
            this.localAgencyTypeCodeIDMap.set(item.code, item.code);
          })
        }
        this.showSpinner = false;
      }
    },
    error: (error) => {
      console.log('Request failed with error');
      this.showSpinner = false;
    }
  })
  }
  getFileOwners() {
    this.fileOwners = [];
    this.showSpinner = true;
    this.appService.getUsers().subscribe({next: (response) => {
      let resp = Object.assign(response);
      if(resp){
        if(resp.length){
          resp.forEach((item:any) => {
            this.fileOwners.push({ label: item.display_name, value: item.username })
          })
        }
        this.showSpinner = false;
      }
    },
    error: (error) => {
      console.log('Request failed with error');
      this.showSpinner = false;
    }
  })
  }
  getForeignCountries() {
    this.foreignCountries = [];
    this.showSpinner = true;
    this.appService.getMasterDataByType('COUNTRY').subscribe({next: (response) => {
      let resp = Object.assign(response);
      if(resp){
        if(resp.length){
          resp.forEach((item:any) => {
            this.foreignCountries.push({ label: item.value, value: item.code })
            this.foreignAgencyCountryCodeIDMap.set(item.code, item.code);
          })
        }
        this.showSpinner = false;
      }
    },
    error: (error) => {
      console.log('Request failed with error');
      this.showSpinner = false;
    }
  })
  }
  getForeignAgencyTypes(countryCodeID: any) {
    this.foreignAgencyTypes = [];
    this.foreignAgencyNames = [];
    this.showSpinner = true;
    this.appService.getMasterDataByTypeAndParent('AGENCY_TYPE_FOREIGN',countryCodeID).subscribe({next: (response) => {
      let resp = Object.assign(response);
      if(resp){
        if(resp.length){
          resp.forEach((item:any) => {
            this.foreignAgencyTypes.push({ label: item.value, value: item.code })
            this.foreignAgencyTypeCodeIDMap.set(item.code, item.code);
          })
        }
        this.showSpinner = false;
      }
    },
    error: (error) => {
      console.log('Request failed with error');
      this.showSpinner = false;
    }
  })
  }
  onLocalForeignChange(data: any){
    if (data.value === 'ADDR_F'){
      this.showLocalAgencyDetails = false;
      this.showForeignAgencyDetails = true;
      this.getForeignCountries();
    } else{
      this.showLocalAgencyDetails = true;
      this.showForeignAgencyDetails = false;
      this.getLocalAgencyTypes();
    }
    this.advisoryFile.LocalOrForeign = data.value;
  }
  onForeignAgencyCountryChange(data: any) {
    this.getForeignAgencyTypes(this.foreignAgencyCountryCodeIDMap.get(data.value));
  }
  onLocalAgencyTypeChange(data: any){
    this.localAgencyNames = [];
    this.showSpinner = true;
    this.appService.getMasterDataByType('EXTERNAL_AGENCY_NAME').subscribe({next: (response) => {
      let resp = Object.assign(response);
      if(resp){
        if(resp.length){
          resp.forEach((item:any) => {
            this.localAgencyNames.push({ label: item.value, value: item.code })
          })
        }
        this.showSpinner = false;
      }
    },
    error: (error) => {
      console.log('Request failed with error');
      this.showSpinner = false;
    }
  })
  }
  onForeignAgencyTypeChange(data: any){
    this.foreignAgencyNames = [];
    this.showSpinner = true;
    this.appService.getMasterDataByType('AGENCY_NAME_FOREIGN').subscribe({next: (response) => {
      let resp = Object.assign(response);
      if(resp){
        if(resp.length){
          resp.forEach((item:any) => {
            this.foreignAgencyNames.push({ label: item.value, value: item.code })
          })
        }
        this.showSpinner = false;
      }
    },
    error: (error) => {
      console.log('Request failed with error');
      this.showSpinner = false;
    }
  })
  }
  onFileDivisionChange(data: any) {
    this.showSpinner = true;
    let divItemID: any = this.fileDivisionItemIDMap.get(data.value);
    this.getFileHeader1(divItemID);
  }
  onFileHeader1Change(data: any) {
    this.showSpinner = true;
    let header1ItemID: any = this.fileHeader1ItemIDMap.get(data.value);
    this.getFileHeader2(header1ItemID);
  }
  onFileHeader2Change(data: any) {
    this.getFileYear();
  }
  onFileYearChange(data: any){
    if(data.value){
      this.advisoryFile.ReferenceNo = "AG/"+this.advisoryFile.I_Division+"/"+this.advisoryFile.I_Header1+"/"+this.advisoryFile.I_Header2+"/"+this.advisoryFile.I_Year+"/"+this.advisoryFile.I_SerialNo;
      this.reqIDAvailable = true;
    }
  }
  onSubmit() {
    this.formSubmitted = true;
    if (this.advfileForm && !this.advfileForm.valid) {
      this.reqSubmit.emit({ status: 'FAILURE' });
      this.utilService.alert('error', 'Error', 'Please fill all mandatory details!!', false);
    } else {
      let reqDetails:any = _.cloneDeep(this.advisoryFile)
      reqDetails.Sensitivity = reqDetails.Sensitivity == 'Yes'? true: false
      reqDetails.FileCreatedBy = UtilityService.CURRENT_USER_NAME;
      reqDetails.FileCreatedDate = new Date(); 

      let descQueryParam = reqDetails.SecurityClassification+','+reqDetails.LocalForeign+','+
        reqDetails.AgencyType+','+reqDetails.AgencyName+','+reqDetails.CountryForeignOrg+','+reqDetails.ForeignAgencyType+","+
        reqDetails.ForeignAgencyName+','+reqDetails.FileStatus;
      this.appService.getMasterDataByCodes(descQueryParam).subscribe({next: (response)=>{
        let masterDataMap: Map<string,string> = new Map();
        let resp = Object.assign(response);
        if(resp){
          if(resp.length){
            resp.forEach((item:any) => {
              masterDataMap.set(item.code,item.value)
            })
          }
          reqDetails.SecurityClassificationDesc = masterDataMap.get(reqDetails.SecurityClassification)
          reqDetails.LocalForeignDesc = masterDataMap.get(reqDetails.LocalForeign)
          reqDetails.AgencyTypeDesc = masterDataMap.get(reqDetails.AgencyType)
          reqDetails.AgencyNameDesc = masterDataMap.get(reqDetails.AgencyName)
          reqDetails.CountryForeignOrgDesc = masterDataMap.get(reqDetails.CountryForeignOrg)
          reqDetails.FileForeignAgencyTypeDesc = masterDataMap.get(reqDetails.ForeignAgencyType)
          reqDetails.ForeignAgencyNameDesc = masterDataMap.get(reqDetails.ForeignAgencyName)
          reqDetails.FileStatusDesc = masterDataMap.get(reqDetails.FileStatus)

          this.appService.generateSequence('Advisory File').subscribe({next: (response) => {
            let resp = Object.assign(response);
            if(resp){
              this.appService.createFile(reqDetails).subscribe({next: (response) => {
                let createResp = Object.assign(response);
                if(createResp){
                  let refNo= createResp[0].ReferenceNo;
                  this.utilService.alert('success','Success','Advisory File '+refNo+' created successfully', false)
                  this.reqSubmit.emit({ status: 'SUCCESS' });
                }
              },
              error: (error) => {
                console.log('Request failed with error');
                this.showSpinner = false;
              }
            })
            }
          },
          error: (error) => {
            console.log('Request failed with error');
            this.showSpinner = false;
          }
          })
        }
      },
      error: (error)=>{
        console.log('Request failed with error');
        this.showSpinner = false;
      }
    })
    }
  }
}
