import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UtilityService } from 'src/app/commons/utilities.service';
import { MLA_FILE } from 'src/app/entities/mla-file';
import * as _ from "lodash";
import { ActivatedRoute } from '@angular/router';
import { AppService } from '../commons/app.service';

@Component({
  selector: 'mla-file',
  templateUrl: './mla-file.component.html',
  styleUrls: ['./mla-file.component.scss']
})
export class MlaFileComponent implements OnInit, OnChanges {
  constructor(private utilService: UtilityService, private datePipe: DatePipe,
    private route: ActivatedRoute, private appService: AppService) {  }

  readOnly: boolean = false;
  mlaFile!: MLA_FILE;
  allFileDivisions: any[] = [];
  fileDivisions: any[] = [];
  header1: any[] = [];
  header2: any[] = [];
  year: any[] = [];
  todaysDate: Date = new Date();
  caseTypes: any[] = [];
  caseSubTypes: any[] = [];
  caseStatus: any[] = [];
  secClassification: any[] = [];
  fileOrigin: any[] = [];
  fileCmplxts: any[] = [];
  reqUnder: any[] = [];
  fatfPurposes: any[] = [];
  showForeignAgencyDetails: boolean = false;
  showLocalAgencyDetails: boolean = true;
  cfList: any[] = [];
  fAgencyTypes: any[] = [];
  fAgencyNames: any[] = [];
  lAgencyTypes: any[] = [];
  lAgencyNames: any[] = [];
  @ViewChild('mlaFileForm') reqForm!: NgForm;
  formSubmitted: boolean = false;
  @Input() modalSubmit: boolean = false;
  @Output() reqSubmit = new EventEmitter<any>();
  alertMessages: any[] = [];
  fileDivisionItemIDMap: Map<string,string> = new Map<string, string>();
  fileHeader1ItemIDMap: Map<string, string> = new Map<string, string>();
  fileHeader2ItemIDMap: Map<string, string> = new Map<string, string>();
  localAgencyTypeCodeIDMap: Map<string, string> = new Map<string, string>();
  foreignAgencyTypeCodeIDMap: Map<string, string> = new Map<string, string>();
  foreignAgencyCountryCodeIDMap: Map<string, string> = new Map<string, string>();
  urlParams: string = '';
  requestNumber!: string | null;
  showSpinner: boolean = false;
  reqIDAvailable: boolean = false;

  ngOnInit(): void {
    this.showSpinner = true;
    this.formSubmitted = false;
    this.mlaFile = new MLA_FILE();
    this.setSerialNo();
    this.getAGItemID()
    this.getFileOrigins();
    this.getCaseStatus();
    this.getSecurityClassifications();
    this.getFileComplexity();
    this.getFATFPurpose();
    this.mlaFile.FileType = 'MLA';
    this.urlParams = window.location.href;
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['modalSubmit'].currentValue) {
      this.onSubmit()
    }
  }
  setSerialNo(){
    this.showSpinner = true;
    this.appService.getSequence('MLA File').subscribe((response) => {
      let resp = Object.assign(response)
      let prefix = resp[0].prefix?resp[0].prefix:''
      let count = Number(resp[0].seq_count)+1
      let suffix = resp[0].suffix?resp[0].suffix:''
      this.mlaFile.I_SerialNo = prefix + count + suffix;
    },
    (error) => {
      console.error("Request failed with error")
      this.showSpinner = false;
    })
  }
  onRequestOriginChange(data: any){
    if (data.value == 'ADDR_F'){
      this.showLocalAgencyDetails = false;
      this.showForeignAgencyDetails = true;
      this.getForeignCountries();
    } else{
      this.showLocalAgencyDetails = true;
      this.showForeignAgencyDetails = false;
      this.getLocalAgencyTypes();
    }
    this.mlaFile.LocalOrForeign = data.value
  }
  onForeignAgencyCountryChange(data: any) {
    this.getForeignAgencyTypes(this.foreignAgencyCountryCodeIDMap.get(data.value));
  }
  getFileOrigins() {
    this.fileOrigin = [];
    this.showSpinner = true;
    this.appService.getMasterDataByType('FILE_ORIGIN').subscribe((response) => {
      let resp = Object.assign(response)
      if(resp){
        if(resp.length){
          resp.forEach((item:any) => {
            this.fileOrigin.push({ label: item.value, value: item.code })
          })
        }
        this.mlaFile.LocalForeign = 'ADDR_L';
        this.mlaFile.LocalOrForeign = 'ADDR_L';
        this.getLocalAgencyTypes();
        this.showSpinner = false;
      }
    },
    (error) => {
      console.error('Request failed with error')
      this.showSpinner = false;
    })
  }
  getCaseTypes() {
    this.caseTypes = [];
    this.mlaFile.MLACaseType = '';
    this.showSpinner = true;
    this.appService.getMasterDataByType('MLA_CASE_TYPE').subscribe((response) => {
      let resp = Object.assign(response)
      if(resp){
        if(resp.length){
          resp.forEach((item:any) => {
            this.caseTypes.push({ label: item.value, value: item.code })
          })
        }
        if (_.includes(this.mlaFile.I_Header1, 'MLA')){
          this.mlaFile.MLACaseType = 'MLA'
          let data = {
            value: 'MLA'
          }
          this.onCaseTypeChange(data);
        } else if (_.includes(this.mlaFile.I_Header1, 'EXT')) {
          this.mlaFile.MLACaseType = 'EXTRADITION'
          let data = {
            value: 'EXT'
          }
          this.onCaseTypeChange(data);
        }
        this.showSpinner = false;
      }
    },
    (error) => {
      console.error('Request failed with error')
      this.showSpinner = false;
    })
  }
  getCaseSubTypes() {
    this.caseSubTypes = [];
    this.mlaFile.MLASubType='';
    this.showSpinner = true;
    this.appService.getMasterDataByType('MLA_CASE_SUB_TYPE').subscribe((response) => {
      let resp = Object.assign(response)
      if(resp){
        if(resp.length){
          resp.forEach((item:any) => {
            this.caseSubTypes.push({ label: item.value, value: item.code })
          })
        }
        if (_.includes(this.mlaFile.I_Header2, '-T')) {
          this.mlaFile.MLASubType = 'O'
        } else if (_.includes(this.mlaFile.I_Header2, '-F')) {
          this.mlaFile.MLASubType = 'I'
        }
        this.showSpinner = false;
      }
    },
    (error) => {
      console.error('Request failed with error')
      this.showSpinner = false;
    })
  }
  getAGItemID(){
    this.showSpinner = true;
    this.appService.getMasterDataByType('ROOT_CODE').subscribe((response) => {
      let resp = Object.assign(response)
      if(resp){
        this.getFileDivisions(resp[0].code)
        this.showSpinner = false;
      }
    },
    (error) => {
      console.log('Request failed with error');
      this.showSpinner = false;
    })
  }
  getFileDivisions(agItemID: string) {
    this.allFileDivisions = [];
    this.showSpinner = true;
    this.appService.getMasterDataByTypeAndParent('FILE_DIVISION', agItemID).subscribe((response) => {
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
    (error) => {
      console.log('Request failed with error')
      this.showSpinner = false;
    })
  }
  getCurrentUserFileDivisions(){
    this.fileDivisions = [];
    this.showSpinner = true;
    this.appService.getUserDivisions(UtilityService.CURRENT_USER_NAME).subscribe((response) => {
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
    (error) => {
      console.log('Request failed with error');
      this.showSpinner = false;
    })
  }
  getFileHeader1(divItemID: string) {
    this.header1 = []
    this.showSpinner = true;
    this.appService.getMasterDataByTypeAndParent('FILE_HEADER1',divItemID).subscribe((response) => {
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
    (error) => {
      console.log('Request failed with error');
      this.showSpinner = false;
    })
  }
  getFileHeader2(header1ItemID: string) {
    this.header2 = []
    this.showSpinner = true;
    this.appService.getMasterDataByTypeAndParent('FILE_HEADER2',header1ItemID).subscribe((response) => {
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
    (error) => {
      console.log('Request failed with error');
      this.showSpinner = false;
    })
  }
  getFileYear() {
    this.year = []
    this.showSpinner = true;
    this.appService.getMasterDataByType('FILE_YEAR').subscribe((response) => {
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
    (error) => {
      console.log('Request failed with error');
      this.showSpinner = false;
    })
  }
  getFileComplexity() {
    this.fileCmplxts = [];
    this.showSpinner = true;
    this.appService.getMasterDataByType('CASE_COMPLEXITY').subscribe((response) => {
      let resp = Object.assign(response);
      if(resp){
        if(resp.length){
          resp.forEach((item:any) => {
            this.fileCmplxts.push({ label: item.value, value: item.code })
          })
        }
        this.showSpinner = false;
      }
    },
    (error) => {
      console.log('Request failed with error');
      this.showSpinner = false;
    })
  }
  getSecurityClassifications() {
    this.secClassification = [];
    this.showSpinner = true;
    this.appService.getMasterDataByType('SECURITY_CLASSIFICATION').subscribe((response) => {
      let resp = Object.assign(response);
      if(resp){
        if(resp.length){
          resp.forEach((item:any) => {
            this.secClassification.push({ label: item.value, value: item.code })
          })
        }
        this.mlaFile.SecurityClassification = 'SCLASS_S'
        this.showSpinner = false;
      }
    },
    (error) => {
      console.log('Request failed with error')
      this.showSpinner = false;
    })
  }
  getFATFPurpose(){
    this.fatfPurposes = [];
    this.showSpinner = true;
    this.appService.getMasterDataByType('CASE_FATF').subscribe((response) => {
      let resp = Object.assign(response);
      if(resp){
        if(resp.length){
          resp.forEach((item:any) => {
            this.fatfPurposes.push({ label: item.value, value: item.code })
          })
        }
        this.showSpinner = false;
      }
    },
    (error) => {
      console.log('Request failed with error');
      this.showSpinner = false;
    })
  }
  getLocalAgencyTypes() {
    this.lAgencyTypes = [];
    this.showSpinner = true;
    this.appService.getMasterDataByType('EXTERNAL_AGENCY_TYPE').subscribe((response) => {
      let resp = Object.assign(response);
      if(resp){
        if(resp.length){
          resp.forEach((item:any) => {
            this.lAgencyTypes.push({ label: item.value, value: item.code })
            this.localAgencyTypeCodeIDMap.set(item.code, item.code);
          })
        }
        this.showSpinner = false;
      }
    },
    (error) => {
      console.log('Request failed with error');
      this.showSpinner = false;
    })
  }
  getForeignCountries() {
    this.cfList = [];
    this.showSpinner = true;
    this.appService.getMasterDataByType('COUNTRY').subscribe((response) => {
      let resp = Object.assign(response);
      if(resp){
        if(resp.length){
          resp.forEach((item:any) => {
            this.cfList.push({ label: item.value, value: item.code })
            this.foreignAgencyCountryCodeIDMap.set(item.code, item.code);
          })
        }
        this.showSpinner = false;
      }
    },
    (error) => {
      console.log('Request failed with error');
      this.showSpinner = false;
    })
  }
  getForeignAgencyTypes(countryCodeID: any) {
    this.fAgencyTypes = [];
    this.fAgencyNames = [];
    this.showSpinner = true;
    this.appService.getMasterDataByTypeAndParent('AGENCY_TYPE_FOREIGN',countryCodeID).subscribe((response) => {
      let resp = Object.assign(response);
      if(resp){
        if(resp.length){
          resp.forEach((item:any) => {
            this.fAgencyTypes.push({ label: item.value, value: item.code })
            this.foreignAgencyTypeCodeIDMap.set(item.code, item.code);
          })
        }
        this.showSpinner = false;
      }
    },
    (error) => {
      console.log('Request failed with error');
      this.showSpinner = false;
    })
  }
  getCaseStatus() {
    this.caseStatus = [];
    this.showSpinner = true;
    this.appService.getMasterDataByType('CASE_STATUS').subscribe((response) => {
      let resp = Object.assign(response);
      if(resp){
        if(resp.length){
          resp.forEach((item:any) => {
            this.caseStatus.push({ label: item.value, value: item.code })
          })
        }
        this.showSpinner = false;
      }
        this.mlaFile.FileStatus = 'CSTAT_DO'
        this.mlaFile.MLACaseStatus = 'CSTAT_DO'
    },
    (error) => {
      console.log('Request failed with error');
      this.showSpinner = false;
    })
  }
  getRequestedUnder(caseTypeRequestUnder: string) {
    this.reqUnder = [];
    this.showSpinner = true;
    this.appService.getMasterDataByTypeAndParent('REQUESTED_UNDER',caseTypeRequestUnder).subscribe((response) => {
      let resp = Object.assign(response);
      if(resp){
        if(resp.length){
          resp.forEach((item:any) => {
            this.reqUnder.push({ label: item.value, value: item.code })
          })
        }
        this.showSpinner = false;
      }
    },
    (error) => {
      console.log('Request failed with error');
      this.showSpinner = false;
    })
  }
  onLocalAgencyTypeChange(data: any) {
    this.lAgencyNames = [];
    this.showSpinner = true;
    this.appService.getMasterDataByType('EXTERNAL_AGENCY_NAME').subscribe((response) => {
      let resp = Object.assign(response);
      if(resp){
        if(resp.length){
          resp.forEach((item:any) => {
            this.lAgencyNames.push({ label: item.value, value: item.code })
          })
        }
        this.showSpinner = false;
      }
    },
    (error) => {
      console.log('Request failed with error');
      this.showSpinner = false;
    })
  }
  onForeignAgencyTypeChange(data: any) {
    this.fAgencyNames = [];
    this.showSpinner = true;
    this.appService.getMasterDataByType('AGENCY_NAME_FOREIGN').subscribe((response) => {
      let resp = Object.assign(response);
      if(resp){
        if(resp.length){
          resp.forEach((item:any) => {
            this.fAgencyNames.push({ label: item.value, value: item.code })
          })
        }
        this.showSpinner = false;
      }
    },
    (error) => {
      console.log('Request failed with error');
      this.showSpinner = false;
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
    this.getCaseTypes();
  }
  onFileHeader2Change(data: any) {
    this.getFileYear();
    if (data.value == 'MLA-F'){
      this.mlaFile.I_MLA_HOA = 'HA_MLAI_MACMA'
    } else if (data.value == 'MLA-T'){
      this.mlaFile.I_MLA_HOA = 'HA_MLAO_MACMA'
    } else if (data.value == 'EXTR-T') {
      this.mlaFile.I_MLA_HOA = 'HA_EXTRADITION'
    } else if (data.value == 'EXTR-F') {
      this.mlaFile.I_MLA_HOA = 'HA_EXTRADITION'
    } else{
      this.mlaFile.I_MLA_HOA = ''
    }
    this.getCaseSubTypes();
  }
  onFileYearChange(data: any){
    if(data.value){
      this.mlaFile.ReferenceNo = "AG/"+this.mlaFile.I_Division+"/"+this.mlaFile.I_Header1+"/"+this.mlaFile.I_Header2+"/"+this.mlaFile.I_Year+"/"+this.mlaFile.I_SerialNo;
      this.reqIDAvailable = true;
    }
  }
  onCaseTypeChange(data: any){
    if (data.value === 'MLA'){
      this.getRequestedUnder('REQUEST_UNDER_MLA');
    } else{
      this.getRequestedUnder('REQUEST_UNDER_EXTRADITION');
    }
  }
  onSubmit() {
    this.formSubmitted = true;
    if (this.reqForm && !this.reqForm.valid) {
      this.reqSubmit.emit({ status: 'FAILURE' });
      this.utilService.alert('error', 'Error', 'Please fill all mandatory details!!', false);
    } else {
      let mla_file:any = _.cloneDeep(this.mlaFile);
      mla_file.MLAReceivedDate = mla_file.MLAReceivedDate ? this.datePipe.transform(mla_file.MLAReceivedDate, "yyyy-MM-dd'T'hh:mm:ss") : null;
      mla_file.MLAFileOpenDate = mla_file.MLAFileOpenDate ? this.datePipe.transform(mla_file.MLAFileOpenDate, "yyyy-MM-dd'T'hh:mm:ss") : null;
      mla_file.MLAOutgoingSentDate = mla_file.MLAOutgoingSentDate ? this.datePipe.transform(mla_file.MLAOutgoingSentDate, "yyyy-MM-dd'T'hh:mm:ss") : null;
      mla_file.MLARequestPerfectedDate = mla_file.MLARequestPerfectedDate ? this.datePipe.transform(mla_file.MLARequestPerfectedDate, "yyyy-MM-dd'T'hh:mm:ss") : null;
      mla_file.Sensitivity = mla_file.Sensitivity == 'Yes' ? true : false
      mla_file.FileCreatedBy = UtilityService.CURRENT_USER_NAME;
      mla_file.FileCreatedDate = this.datePipe.transform(new Date(), "yyyy-MM-dd'T'hh:mm:ss");
      
      let descQueryParam = mla_file.SecurityClassification+','+mla_file.LocalForeign+','+
        mla_file.AgencyType+','+mla_file.AgencyName+','+mla_file.CountryForeignOrg+','+mla_file.ForeignAgencyType+","+
        mla_file.ForeignAgencyName+','+mla_file.FileStatus+','+mla_file.MLACaseStatus+','+mla_file.MLAComplexity+','+
        mla_file.MLAFATFPurpose+','+mla_file.MLARequestedUnder+','+mla_file.MLASubType;
      this.appService.getMasterDataByCodes(descQueryParam).subscribe((response) => {
        let masterDataMap: Map<string,string> = new Map();
        let resp = Object.assign(response);
        if(resp){
          if(resp.length){
            resp.forEach((item:any) => {
              masterDataMap.set(item.code,item.value)
            })
          }
          mla_file.SecurityClassificationDesc = masterDataMap.get(mla_file.SecurityClassification)
          mla_file.LocalForeignDesc = masterDataMap.get(mla_file.LocalForeign)
          mla_file.AgencyTypeDesc = masterDataMap.get(mla_file.AgencyType)
          mla_file.AgencyNameDesc = masterDataMap.get(mla_file.AgencyName)
          mla_file.CountryForeignOrgDesc = masterDataMap.get(mla_file.CountryForeignOrg)
          mla_file.FileForeignAgencyTypeDesc = masterDataMap.get(mla_file.ForeignAgencyType)
          mla_file.ForeignAgencyNameDesc = masterDataMap.get(mla_file.ForeignAgencyName)
          mla_file.FileStatusDesc = masterDataMap.get(mla_file.FileStatus)
          mla_file.MLACaseStatusDesc = masterDataMap.get(mla_file.MLACaseStatus)
          mla_file.MLAComplexityDesc = masterDataMap.get(mla_file.MLAComplexity)
          mla_file.MLAFATFPurposeDesc = masterDataMap.get(mla_file.MLAFATFPurpose)
          mla_file.MLARequestedUnderDesc = masterDataMap.get(mla_file.MLARequestedUnder)
          mla_file.MLASubTypeDesc = masterDataMap.get(mla_file.MLASubType)

          this.appService.generateSequence('MLA File').subscribe((response) => {
            let resp = Object.assign(response);
            if(resp){
              this.appService.createFile(mla_file).subscribe((response) => {
                let createResp = Object.assign(response);
                if(createResp){
                  let refNo= createResp[0].ReferenceNo;
                  this.utilService.alert('success','Success','MLA File '+refNo+' created successfully', false)
                  this.reqSubmit.emit({ status: 'SUCCESS' });
                }
              })
            }
          },
          (error) => {
            console.log('Request failed with error');
            this.showSpinner = false;
          })
        }
      },
      (error) => {
        console.log('Request failed with error');
        this.showSpinner = false;
      })
    }
  }
}
