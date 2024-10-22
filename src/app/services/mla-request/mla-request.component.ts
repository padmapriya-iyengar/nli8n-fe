import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as _ from 'lodash';
import { MLA_REQUEST } from '../../entities/mla-request';
import { UtilitiesService } from '../../commons/services/utilities.service';
import { DatePipe } from '@angular/common';
import { AgcService } from 'src/app/commons/services/agc.service';

@Component({
  selector: 'mla-request',
  templateUrl: './mla-request.component.html',
  styleUrls: ['./mla-request.component.scss']
})
export class MlaRequestComponent implements OnInit, OnChanges {
  todaysDate: Date = new Date();
  readOnly: boolean = false;
  mlaRequest!: MLA_REQUEST;
  formSubmitted: boolean = false;
  reqType: any[] = [];
  reqCmplxts: any[] = [];
  reqModes: any[] = [];
  secClassification: any[] = [];
  reqUrgency: any[] = [];
  allDivisions: any[] = [];
  reqDivisions: any[] = [];
  showForeignAgencyDetails: boolean = false;
  reqStatus: any[] = [];
  reqLocalAgencyTypes: any[] = [];
  reqLocalAgencyNames: any[] = [];
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

  constructor(private utilService: UtilitiesService, private datePipe: DatePipe,
    private agcService: AgcService) { }

  @ViewChild('mlaRequestForm') reqForm!: NgForm;
  @Output() reqSubmit = new EventEmitter<any>();
  @Input() modalSubmit: boolean = false;
  cmplxTimeMap: Map<string, number> = new Map<string, number>();

  ngOnInit(): void {
    this.formSubmitted = false;
    this.mlaRequest = new MLA_REQUEST();
    this.setSerialNo();
    this.getSecurityClassifications();
    this.getRequestStatus();
    this.getRequestComplexity();
    this.getRequestTypes();
    this.getRequestModes();
    this.getRequestUrgency();
    this.getLocalAgencyTypes();
    this.getAGItemID();
    this.getFileOrigins();
    this.getFileReferences();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['modalSubmit'].currentValue) {
      this.onSubmit()
    }
  }
  setSerialNo(){
    this.showSpinner = true;
    this.agcService.getSequence('MLA Request').subscribe({next: (response) => {
      let resp = Object.assign(response)
      let prefix = resp[0].prefix?resp[0].prefix:''
      let count = Number(resp[0].seq_count)+1
      let suffix = resp[0].suffix?resp[0].suffix:''
      this.mlaRequest.RequestNo = prefix + count + suffix;
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
    this.agcService.getMasterDataByType('SECURITY_CLASSIFICATION').subscribe({next: (response) => {
      let resp = Object.assign(response);
      if(resp){
        if(resp.length){
          resp.forEach((item:any) => {
            this.secClassification.push({ label: item.value, value: item.code })
          })
        }
        this.mlaRequest.SecurityClassification = 'SCLASS_S';
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
    this.agcService.getMasterDataByType('REQUEST_STATUS').subscribe({next: (response) => {
      let resp = Object.assign(response);
      if(resp){
        if(resp.length){
          resp.forEach((item:any) => {
            this.reqStatus.push({ label: item.value, value: item.code });
          })
        }
        this.mlaRequest.RequestStatus = 'RSTAT_O'
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
    this.agcService.getMasterDataByType('REQUEST_COMPLEXITY').subscribe({next: (response) => {
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
    error: (error) => {
      console.log('Request failed with error');
      this.showSpinner = false;
    }
  })
  }
  getRequestTypes() {
    this.reqType = [];
    this.showSpinner = true;
    this.agcService.getMasterDataByType('REQUEST_TYPE').subscribe({next: (response) => {
      let resp = Object.assign(response);
      if(resp){
        if(resp.length){
          resp.forEach((item:any) => {
            this.reqType.push({ label: item.value, value: item.code });
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
  getRequestModes() {
    this.reqModes = [];
    this.showSpinner = true;
    this.agcService.getMasterDataByType('REQUEST_MODE').subscribe({next: (response) => {
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
  getRequestUrgency() {
    this.reqUrgency = [];
    this.showSpinner = true;
    this.agcService.getMasterDataByType('REQUEST_URGENCY').subscribe({next: (response) => {
      let resp = Object.assign(response);
      if(resp){
        if(resp.length){
          resp.forEach((item:any) => {
            this.reqUrgency.push({ label: item.value, value: item.code });
          })
        }
        this.mlaRequest.Urgency = 'RURGENT_NU'
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
    this.agcService.getMasterDataByType('EXTERNAL_AGENCY_TYPE').subscribe({next: (response) => {
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
    this.agcService.getMasterDataByType('FILE_ORIGIN').subscribe({next: (response) => {
      let resp = Object.assign(response)
      if(resp){
        if(resp.length){
          resp.forEach((item:any) => {
            this.fileOrigin.push({ label: item.value, value: item.code })
          })
        }
        this.mlaRequest.LocalForeign = 'ADDR_L';
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
    this.agcService.getMasterDataByType('ROOT_CODE').subscribe({next: (response) => {
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
    this.agcService.getMasterDataByTypeAndParent('FILE_DIVISION', agItemID).subscribe({next: (response) => {
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
    this.agcService.getUserDivisions(UtilitiesService.CURRENT_USER_NAME).subscribe({next: (response) => {
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
  onComplexityChange(data: any) {
    let days: any;
    if (this.mlaRequest.ReceivedDate) {
      days = this.cmplxTimeMap.get(data.value);
      this.utilService.addDays(this.mlaRequest.ReceivedDate, days, this.mlaRequest, 'RequestDueDate');
    }
  }
  onReceivedDateChange(data: any) {
    let days: any;
    if (!this.utilService.isEmpty(this.mlaRequest.Complexity)) {
      days = this.cmplxTimeMap.get(this.mlaRequest.Complexity);
      this.utilService.addDays(data, days, this.mlaRequest, 'RequestDueDate');
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
  onForeignAgencyCountryChange(data: any) {
    this.getForeignAgencyTypes(this.foreignAgencyCountryCodeIDMap.get(data.value));
  }
  getForeignCountries() {
    this.foreignCountries = [];
    this.showSpinner = true;
    this.agcService.getMasterDataByType('COUNTRY').subscribe({next: (response) => {
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
    this.agcService.getMasterDataByTypeAndParent('AGENCY_TYPE_FOREIGN',countryCodeID).subscribe({next: (response) => {
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
  onLocalAgencyTypeChange(data: any) {
    this.reqLocalAgencyNames = [];
    this.showSpinner = true;
    this.agcService.getMasterDataByType('EXTERNAL_AGENCY_NAME').subscribe({next: (response) => {
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
    this.agcService.getMasterDataByType('AGENCY_NAME_FOREIGN').subscribe({next: (response) => {
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
    this.agcService.getFileByFilter('type','MLA').subscribe({next: (response) => {
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
      let mla_req: any = _.cloneDeep(this.mlaRequest);
      mla_req.ReceivedDate = mla_req.ReceivedDate ? this.datePipe.transform(mla_req.ReceivedDate, "yyyy-MM-dd'T'hh:mm:ss") : null;
      mla_req.RequestDueDate = mla_req.RequestDueDate ? this.datePipe.transform(mla_req.RequestDueDate, "yyyy-MM-dd'T'hh:mm:ss") : null;
      mla_req.OriginalDueDate = mla_req.RequestDueDate;
      mla_req.ExpResponseDate = mla_req.ExpResponseDate ? this.datePipe.transform(mla_req.ExpResponseDate, "yyyy-MM-dd'T'hh:mm:ss") : null;
      mla_req.Sensitivity = mla_req.Sensitivity == 'Yes' ? true : false
      mla_req.RequestCreatedBy = UtilitiesService.CURRENT_USER_NAME;
      mla_req.RequestCreatedDate = this.datePipe.transform(new Date(), "yyyy-MM-dd'T'hh:mm:ss");

      let descQueryParam = mla_req.RequestType+','+mla_req.RequestStatus+','+mla_req.LocalForeign+','+mla_req.RequestingAgencyType+','+
        mla_req.RequestingAgencyName+','+mla_req.CountryForeignOrg+','+mla_req.ForeignAgencyType+","+mla_req.ForeignAgencyName+','+
        mla_req.SecurityClassification+','+mla_req.RequestReceivedMode+','+mla_req.Complexity+','+mla_req.Urgency;
      
        this.agcService.getMasterDataByCodes(descQueryParam).subscribe({next: (response) => {
          let masterDataMap: Map<string,string> = new Map();
          let resp = Object.assign(response);
          if(resp){
            if(resp.length){
              resp.forEach((item: any) => {
                masterDataMap.set(item.code,item.value)
              })
            }
            mla_req.RequestTypeDesc = masterDataMap.get(mla_req.RequestType)
            mla_req.RequestStatusDesc = masterDataMap.get(mla_req.RequestStatus)
            mla_req.LocalForeignDesc = masterDataMap.get(mla_req.LocalForeign)
            mla_req.RequestingAgencyTypeDesc = masterDataMap.get(mla_req.RequestingAgencyType)
            mla_req.RequestingAgencyNameDesc = masterDataMap.get(mla_req.RequestingAgencyName)
            mla_req.CountryForeignOrgDesc = masterDataMap.get(mla_req.CountryForeignOrg)
            mla_req.ForeignAgencyTypeDesc = masterDataMap.get(mla_req.ForeignAgencyType)
            mla_req.ForeignAgencyNameDesc = masterDataMap.get(mla_req.ForeignAgencyName)
            mla_req.SecurityClassificationDesc = masterDataMap.get(mla_req.SecurityClassification)
            mla_req.RequestReceivedModeDesc = masterDataMap.get(mla_req.RequestReceivedMode)
            mla_req.ComplexityDesc = masterDataMap.get(mla_req.Complexity)
            mla_req.UrgencyDesc = masterDataMap.get(mla_req.Urgency)

            this.agcService.generateSequence('MLA Request').subscribe({next: (response) => {
                let resp = Object.assign(response)
                if(resp){
                    this.agcService.createRequest(this.fileReferenceNo,mla_req).subscribe({next: (response) => {
                      let createResp = Object.assign(response);
                      if(createResp){
                        let reqNo= createResp.RequestNo;
                        this.utilService.alert('success','Success','MLA Request '+reqNo+' created successfully', false)
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