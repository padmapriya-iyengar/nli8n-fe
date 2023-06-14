import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as _ from 'lodash';
import { UtilityService } from 'src/app/commons/services/utilities.service';
import { ADVISORY_REQUEST } from 'src/app/entities/advisory-request';
import { AppService } from '../commons/services/app.service';

@Component({
  selector: 'advisory-request',
  templateUrl: './advisory-request.component.html',
  styleUrls: ['./advisory-request.component.scss']
})
export class AdvisoryRequestComponent implements OnInit,OnChanges {
  constructor(private utilService: UtilityService, private datePipe: DatePipe,
    private appService: AppService) { }

  advisoryRequest!: ADVISORY_REQUEST;
  readOnly: boolean = false;
  secClassification: any[] = [];
  reqType: any[] = [];
  reqStatus: any[] = [];
  reqModes: any[] = [];
  reqCmplxts: any[] = [];
  reqUrgency: any[] = [];
  allDivisions: any[] = [];
  reqDivisions: any[] = [];
  todaysDate: Date = new Date();
  @ViewChild('advReqForm') reqForm!: NgForm;
  formSubmitted: boolean = false;
  @Input() modalSubmit: boolean = false;
  @Output() reqSubmit = new EventEmitter<any>();
  alertMessages: any[] = [];
  reqLocalAgencyTypes: any[] = [];
  reqLocalAgencyNames: any[] = [];
  cmplxTimeMap: Map<string, number> = new Map<string, number>();
  showForeignAgencyDetails: boolean = false;
  foreignAgencyNames: any[] = [];
  foreignAgencyTypes: any[] = [];
  foreignCountries: any[] = [];
  localAgencyTypeCodeIDMap: Map<string, string> = new Map<string, string>();
  foreignAgencyTypeCodeIDMap: Map<string, string> = new Map<string, string>();
  foreignAgencyCountryCodeIDMap: Map<string, string> = new Map<string, string>();
  fileOrigin: any[] = [];
  showSpinner: boolean = false;
  reqIDAvailable: boolean = false;
  fileReferenceNo: string = '';
  fileReferences:any[] = [];

  ngOnInit(): void {
    this.formSubmitted = false;
    this.advisoryRequest = new ADVISORY_REQUEST();
    this.setSerialNo();
    this.getSecurityClassifications();
    this.getRequestStatus();
    this.getRequestComplexity();
    this.getRequestTypes();
    this.getRequestModes();
    this.getRequestUrgency();
    this.getAGItemID();
    this.getFileOrigins();
    this.getFileReferences();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['modalSubmit'].currentValue){
      this.onSubmit()
    }
  }
  setSerialNo(){
    this.showSpinner = true;
    this.appService.getSequence('Advisory Request').subscribe({next: (response) => {
      let resp = Object.assign(response)
      let prefix = resp[0].prefix?resp[0].prefix:''
      let count = Number(resp[0].seq_count)+1
      let suffix = resp[0].suffix?resp[0].suffix:''
      this.advisoryRequest.RequestNo = prefix + count + suffix;
      this.reqIDAvailable = true;
    },
    error: (error) => {
      console.error("Request failed with error")
      this.showSpinner = false;
    }
  })
  }
  getSecurityClassifications() {
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
        this.advisoryRequest.SecurityClassification = 'SCLASS_S';
        this.showSpinner = false;
      }
    },
    error: (error) => {
      console.log('Request failed with error')
      this.showSpinner = false;
    }
  })
  }
  getRequestStatus() {
    this.reqStatus = [];
    this.showSpinner = true;
    this.appService.getMasterDataByType('REQUEST_STATUS').subscribe({next: (response) => {
      let resp = Object.assign(response);
      if(resp){
        if(resp.length){
          resp.forEach((item:any) => {
            this.reqStatus.push({ label: item.value, value: item.code });
          })
        }
        this.advisoryRequest.RequestStatus = 'RSTAT_O'
        this.showSpinner = false;
      }
    },
    error: (error) => {
      console.log('Request failed with error');
      this.showSpinner = false;
    }
  })
  }
  getRequestComplexity() {
    this.reqCmplxts = [];
    this.showSpinner = true;
    this.appService.getMasterDataByType('REQUEST_COMPLEXITY').subscribe({next: (response) => {
      let resp = Object.assign(response);
      if(resp){
        if(resp.length){
          resp.forEach((item:any) => {
            this.reqCmplxts.push({ label: item.value, value: item.code })
            this.cmplxTimeMap.set(item.code, item.attribute_1);
          })
        }
        this.showSpinner = false;
      }
    },
    error:(error) => {
      console.log('Request failed with error');
      this.showSpinner = false;
    }
  })
  }
  getRequestTypes() {
    this.reqType = [];
    this.showSpinner = true;
    this.appService.getMasterDataByType('REQUEST_TYPE').subscribe({next: (response) => {
      let resp = Object.assign(response);
      if(resp){
        if(resp.length){
          resp.forEach((item:any) => {
            this.reqType.push({ label: item.value, value: item.code });
          })
        }
        this.advisoryRequest.RequestType = 'RTYPE_ADV'
        this.showSpinner = false;
      }
    },
    error: (error) => {
      console.log('Request failed with error');
      this.showSpinner = false;
    }
  })
  }
  getRequestModes() {
    this.reqModes = [];
    this.showSpinner = true;
    this.appService.getMasterDataByType('REQUEST_MODE').subscribe({next: (response) => {
      let resp = Object.assign(response);
      if(resp){
        if(resp.length){
          resp.forEach((item:any) => {
            this.reqModes.push({ label: item.value, value: item.code });
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
  getRequestUrgency(){
    this.reqUrgency = [];
    this.showSpinner = true;
    this.appService.getMasterDataByType('REQUEST_URGENCY').subscribe({next: (response) => {
      let resp = Object.assign(response);
      if(resp){
        if(resp.length){
          resp.forEach((item:any) => {
            this.reqUrgency.push({ label: item.value, value: item.code });
          })
        }
        this.advisoryRequest.Urgency = 'RURGENT_NU'
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
  getLocalAgencyTypes() {
    this.reqLocalAgencyTypes = [];
    this.showSpinner = true;
    this.appService.getMasterDataByType('EXTERNAL_AGENCY_TYPE').subscribe({next: (response) => {
      let resp = Object.assign(response);
      if(resp){
        if(resp.length){
          resp.forEach((item:any) => {
            this.reqLocalAgencyTypes.push({ label: item.value, value: item.code })
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
        this.advisoryRequest.LocalForeign = 'ADDR_L';
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
  getAGItemID() {
    this.showSpinner = true;
    this.appService.getMasterDataByType('ROOT_CODE').subscribe({next: (response) => {
      let resp = Object.assign(response)
      if(resp){
        this.getDivisions(resp[0].code)
        this.showSpinner = false;
      }
    },
    error: (error) => {
      console.log('Request failed with error');
      this.showSpinner = false;
    }
  })
  }
  getDivisions(agItemID: string) {
    this.allDivisions = [];
    this.showSpinner = true;
    this.appService.getMasterDataByTypeAndParent('FILE_DIVISION', agItemID).subscribe({next: (response) => {
      let resp = Object.assign(response)
      if(resp){
        if(resp.length){
          resp.forEach((item:any) => {
            this.allDivisions.push({ label: item.value, value: item.code })
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
    this.reqDivisions = [];
    this.showSpinner = true;
    this.appService.getUserDivisions(UtilityService.CURRENT_USER_NAME).subscribe({next: (response) => {
      let resp = Object.assign(response)
      if(resp){
        if(resp.length){
          resp.forEach((item:any) => {
            let index = _.findIndex(this.allDivisions, function (fg: any) { return fg.value == item.title; })
            if (index != -1) {
              this.reqDivisions.push({ label: item.group_name, value: item.title })
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
  onComplexityChange(data: any){
    let days: any;
    if (this.advisoryRequest.ReceivedDate){
      days = this.cmplxTimeMap.get(data.value);
      this.utilService.addDays(this.advisoryRequest.ReceivedDate, days, this.advisoryRequest, 'RequestDueDate');
    }
  }
  onReceivedDateChange(data: any){
    let days: any;
    if (!this.utilService.isEmpty(this.advisoryRequest.Complexity)) {
      days = this.cmplxTimeMap.get(this.advisoryRequest.Complexity);
      this.utilService.addDays(data, days, this.advisoryRequest, 'RequestDueDate');
    }
  }
  onLocalForeignChange(data: any) {
    if (data.value === 'ADDR_F') {
      this.showForeignAgencyDetails = true;
      this.getForeignCountries();
    } else {
      this.showForeignAgencyDetails = false;
    }
  }
  onForeignAgencyCountryChange(data: any){
    this.getForeignAgencyTypes(this.foreignAgencyCountryCodeIDMap.get(data.value));
  }
  onLocalAgencyTypeChange(data: any) {
    this.reqLocalAgencyNames = [];
    this.showSpinner = true;
    this.appService.getMasterDataByType('EXTERNAL_AGENCY_NAME').subscribe({next: (response) => {
      let resp = Object.assign(response);
      if(resp){
        if(resp.length){
          resp.forEach((item:any) => {
            this.reqLocalAgencyNames.push({ label: item.value, value: item.code })
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
  onForeignAgencyTypeChange(data: any) {
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
  getFileReferences(){
    this.showSpinner = true;
    this.appService.getFileByFilter('type','ADVISORY').subscribe({next: (response) => {
      let resp = Object.assign(response);
      if(resp){
        if(resp.length){
          resp.forEach((item: any) => {
            this.fileReferences.push({label: item.ReferenceNo, value: item.ReferenceNo})
          })
        }
        this.showSpinner = false;
      }
    },
    error: (error) => {
      console.log('Request failed with error');
      this.showSpinner = false;
    }})
  }
  onSubmit() {
    this.formSubmitted = true;
    if (this.reqForm && !this.reqForm.valid) {
      this.reqSubmit.emit({ status: 'FAILURE' });
      this.utilService.alert('error', 'Error', 'Please fill all mandatory details!!', false);
    } else {
      let adv_req: any = _.cloneDeep(this.advisoryRequest);
      adv_req.ReceivedDate = adv_req.ReceivedDate ? this.datePipe.transform(adv_req.ReceivedDate, "yyyy-MM-dd'T'hh:mm:ss") : null;
      adv_req.RequestDueDate = adv_req.RequestDueDate ? this.datePipe.transform(adv_req.RequestDueDate, "yyyy-MM-dd'T'hh:mm:ss") : null;
      adv_req.OriginalDueDate = adv_req.RequestDueDate;
      adv_req.ExpResponseDate = adv_req.ExpResponseDate ? this.datePipe.transform(adv_req.ExpResponseDate, "yyyy-MM-dd'T'hh:mm:ss") : null;
      adv_req.Sensitivity = adv_req.Sensitivity == 'Yes' ? true : false
      adv_req.RequestCreatedBy = UtilityService.CURRENT_USER_NAME;
      adv_req.RequestCreatedDate = this.datePipe.transform(new Date(), "yyyy-MM-dd'T'hh:mm:ss");

      let descQueryParam = adv_req.RequestType+','+adv_req.RequestStatus+','+adv_req.LocalForeign+','+adv_req.RequestingAgencyType+','+
        adv_req.RequestingAgencyName+','+adv_req.CountryForeignOrg+','+adv_req.ForeignAgencyType+","+adv_req.ForeignAgencyName+','+
        adv_req.SecurityClassification+','+adv_req.RequestReceivedMode+','+adv_req.Complexity+','+adv_req.Urgency;
      
        this.appService.getMasterDataByCodes(descQueryParam).subscribe({next: (response) => {
          let masterDataMap: Map<string,string> = new Map();
          let resp = Object.assign(response);
          if(resp){
            if(resp.length){
              resp.forEach((item: any) => {
                masterDataMap.set(item.code,item.value)
              })
            }
            adv_req.RequestTypeDesc = masterDataMap.get(adv_req.RequestType)
            adv_req.RequestStatusDesc = masterDataMap.get(adv_req.RequestStatus)
            adv_req.LocalForeignDesc = masterDataMap.get(adv_req.LocalForeign)
            adv_req.RequestingAgencyTypeDesc = masterDataMap.get(adv_req.RequestingAgencyType)
            adv_req.RequestingAgencyNameDesc = masterDataMap.get(adv_req.RequestingAgencyName)
            adv_req.CountryForeignOrgDesc = masterDataMap.get(adv_req.CountryForeignOrg)
            adv_req.ForeignAgencyTypeDesc = masterDataMap.get(adv_req.ForeignAgencyType)
            adv_req.ForeignAgencyNameDesc = masterDataMap.get(adv_req.ForeignAgencyName)
            adv_req.SecurityClassificationDesc = masterDataMap.get(adv_req.SecurityClassification)
            adv_req.RequestReceivedModeDesc = masterDataMap.get(adv_req.RequestReceivedMode)
            adv_req.ComplexityDesc = masterDataMap.get(adv_req.Complexity)
            adv_req.UrgencyDesc = masterDataMap.get(adv_req.Urgency)

            this.appService.generateSequence('Advisory Request').subscribe({next: (response) => {
                let resp = Object.assign(response)
                if(resp){
                    this.appService.createRequest(this.fileReferenceNo,adv_req).subscribe({next: (response) => {
                      let createResp = Object.assign(response);
                      if(createResp){
                        let reqNo= createResp.RequestNo;
                        this.utilService.alert('success','Success','Advisory Request '+reqNo+' created successfully', false)
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
        error: (error) => {
          console.log('Request failed with error');
          this.showSpinner = false;
        }
      })
    }
  }
}
//@ToDo
//Check error in adddays