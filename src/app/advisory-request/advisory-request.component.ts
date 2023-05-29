import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as _ from 'lodash';
import { UtilityService } from 'src/app/commons/utilities.service';
import { ADVISORY_REQUEST } from 'src/app/entities/advisory-request';
import { AppService } from '../commons/app.service';

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
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['modalSubmit'].currentValue){
      this.onSubmit()
    }
  }
  setSerialNo(){
    this.showSpinner = true;
    this.appService.getSequence('Advisory Request').subscribe((response) => {
      let resp = Object.assign(response)
      let prefix = resp[0].prefix?resp[0].prefix:''
      let count = Number(resp[0].seq_count)+1
      let suffix = resp[0].suffix?resp[0].suffix:''
      this.advisoryRequest.RequestNo = prefix + count + suffix;
      this.reqIDAvailable = true;
    },
    (error) => {
      console.error("Request failed with error")
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
        } else{
          this.secClassification.push({ label: resp.value, value: resp.code })
        }
        this.advisoryRequest.SecurityClassification = 'SCLASS_S';
        this.showSpinner = false;
      }
    },
    (error) => {
      console.log('Request failed with error')
      this.showSpinner = false;
    })
  }
  getRequestStatus() {
    this.reqStatus = [];
    this.showSpinner = true;
    this.appService.getMasterDataByType('REQUEST_STATUS').subscribe((response) => {
      let resp = Object.assign(response);
      if(resp){
        if(resp.length){
          resp.forEach((item:any) => {
            this.reqStatus.push({ label: item.value, value: item.code });
          })
        } else{
          this.reqStatus.push({ label: resp.value, value: resp.code });
        }
        this.advisoryRequest.RequestStatus = 'RSTAT_O'
        this.showSpinner = false;
      }
    },
    (error) => {
      console.log('Request failed with error');
      this.showSpinner = false;
    })
  }
  getRequestComplexity() {
    this.reqCmplxts = [];
    this.showSpinner = true;
    this.appService.getMasterDataByType('REQUEST_COMPLEXITY').subscribe((response) => {
      let resp = Object.assign(response);
      if(resp){
        if(resp.length){
          resp.forEach((item:any) => {
            this.reqCmplxts.push({ label: item.value, value: item.code })
            this.cmplxTimeMap.set(item.code, item.attribute_1);
          })
        } else{
          this.reqCmplxts.push({ label: resp.value, value: resp.code })
            this.cmplxTimeMap.set(resp.code, resp.attribute_1);
        }
        this.showSpinner = false;
      }
    },
    (error) => {
      console.log('Request failed with error');
      this.showSpinner = false;
    })
  }
  getRequestTypes() {
    this.reqType = [];
    this.showSpinner = true;
    this.appService.getMasterDataByType('REQUEST_TYPE').subscribe((response) => {
      let resp = Object.assign(response);
      if(resp){
        if(resp.length){
          resp.forEach((item:any) => {
            this.reqType.push({ label: item.value, value: item.code });
          })
        } else{
          this.reqType.push({ label: resp.value, value: resp.code });
        }
        this.advisoryRequest.RequestType = 'RTYPE_ADV'
        this.showSpinner = false;
      }
    },
    (error) => {
      console.log('Request failed with error');
      this.showSpinner = false;
    })
  }
  getRequestModes() {
    this.reqModes = [];
    this.showSpinner = true;
    this.appService.getMasterDataByType('REQUEST_MODE').subscribe((response) => {
      let resp = Object.assign(response);
      if(resp){
        if(resp.length){
          resp.forEach((item:any) => {
            this.reqModes.push({ label: item.value, value: item.code });
          })
        } else{
          this.reqModes.push({ label: resp.value, value: resp.code });
        }
        this.showSpinner = false;
      }
    },
    (error) => {
      console.log('Request failed with error');
      this.showSpinner = false;
    })
  }
  getRequestUrgency(){
    this.reqUrgency = [];
    this.showSpinner = true;
    this.appService.getMasterDataByType('REQUEST_URGENCY').subscribe((response) => {
      let resp = Object.assign(response);
      if(resp){
        if(resp.length){
          resp.forEach((item:any) => {
            this.reqUrgency.push({ label: item.value, value: item.code });
          })
        } else{
          this.reqUrgency.push({ label: resp.value, value: resp.code });
        }
        this.advisoryRequest.Urgency = 'RURGENT_NU'
        this.showSpinner = false;
      }
    },
    (error) => {
      console.log('Request failed with error');
      this.showSpinner = false;
    })
  }
  getForeignCountries() {
    this.foreignCountries = [];
    this.showSpinner = true;
    this.appService.getMasterDataByType('COUNTRY').subscribe((response) => {
      let resp = Object.assign(response);
      if(resp){
        if(resp.length){
          resp.forEach((item:any) => {
            this.foreignCountries.push({ label: item.value, value: item.code })
            this.foreignAgencyCountryCodeIDMap.set(item.code, item.code);
          })
        } else{
          this.foreignCountries.push({ label: resp.value, value: resp.code })
          this.foreignAgencyCountryCodeIDMap.set(resp.code, resp.code);
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
    this.foreignAgencyTypes = [];
    this.foreignAgencyNames = [];
    this.showSpinner = true;
    this.appService.getMasterDataByTypeAndParent('AGENCY_TYPE_FOREIGN',countryCodeID).subscribe((response) => {
      let resp = Object.assign(response);
      if(resp){
        if(resp.length){
          resp.forEach((item:any) => {
            this.foreignAgencyTypes.push({ label: item.value, value: item.code })
            this.foreignAgencyTypeCodeIDMap.set(item.code, item.code);
          })
        } else{
          this.foreignAgencyTypes.push({ label: resp.value, value: resp.code })
          this.foreignAgencyTypeCodeIDMap.set(resp.code, resp.code);
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
    this.reqLocalAgencyTypes = [];
    this.showSpinner = true;
    this.appService.getMasterDataByType('EXTERNAL_AGENCY_TYPE').subscribe((response) => {
      let resp = Object.assign(response);
      if(resp){
        if(resp.length){
          resp.forEach((item:any) => {
            this.reqLocalAgencyTypes.push({ label: item.value, value: item.code })
            this.localAgencyTypeCodeIDMap.set(item.code, item.code);
          })
        } else{
          this.reqLocalAgencyTypes.push({ label: resp.value, value: resp.code })
          this.localAgencyTypeCodeIDMap.set(resp.code, resp.code);
        }
        this.showSpinner = false;
      }
    },
    (error) => {
      console.log('Request failed with error');
      this.showSpinner = false;
    })
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
        } else{
          this.fileOrigin.push({ label: resp.value, value: resp.code })
        }
        this.advisoryRequest.LocalForeign = 'ADDR_L';
        this.getLocalAgencyTypes();
        this.showSpinner = false;
      }
    },
    (error) => {
      console.error('Request failed with error')
      this.showSpinner = false;
    })
  }
  getAGItemID() {
    this.showSpinner = true;
    this.appService.getMasterDataByType('ROOT_CODE').subscribe((response) => {
      let resp = Object.assign(response)
      if(resp){
        this.getDivisions(resp[0].code)
        this.showSpinner = false;
      }
    },
    (error) => {
      console.log('Request failed with error');
      this.showSpinner = false;
    })
  }
  getDivisions(agItemID: string) {
    this.allDivisions = [];
    this.showSpinner = true;
    this.appService.getMasterDataByTypeAndParent('FILE_DIVISION', agItemID).subscribe((response) => {
      let resp = Object.assign(response)
      if(resp){
        if(resp.length){
          resp.forEach((item:any) => {
            this.allDivisions.push({ label: item.value, value: item.code })
          })
        } else{
          this.allDivisions.push({ label: resp.value, value: resp.code })
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
  getCurrentUserFileDivisions() {
    this.reqDivisions = [];
    this.showSpinner = true;
    this.appService.getUserDivisions(UtilityService.CURRENT_USER_NAME).subscribe((response) => {
      let resp = Object.assign(response)
      if(resp){
        if(resp.length){
          resp.forEach((item:any) => {
            let index = _.findIndex(this.allDivisions, function (fg: any) { return fg.value == item.title; })
            if (index != -1) {
              this.reqDivisions.push({ label: item.group_name, value: item.title })
            }
          })
        } else{
          let index = _.findIndex(this.allDivisions, function (fg: any) { return fg.value == resp.title; })
          if (index != -1) {
            this.reqDivisions.push({ label: resp.group_name, value: resp.title })
          }
        }
        this.showSpinner = false;
      }
    },
    (error) => {
      console.log('Request failed with error');
      this.showSpinner = false;
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
    this.appService.getMasterDataByType('EXTERNAL_AGENCY_NAME').subscribe((response) => {
      let resp = Object.assign(response);
      if(resp){
        if(resp.length){
          resp.forEach((item:any) => {
            this.reqLocalAgencyNames.push({ label: item.value, value: item.code })
          })
        } else{
          this.reqLocalAgencyNames.push({ label: resp.value, value: resp.code })
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
    this.foreignAgencyNames = [];
    this.showSpinner = true;
    this.appService.getMasterDataByType('AGENCY_NAME_FOREIGN').subscribe((response) => {
      let resp = Object.assign(response);
      if(resp){
        if(resp.length){
          resp.forEach((item:any) => {
            this.foreignAgencyNames.push({ label: item.value, value: item.code })
          })
        } else{
          this.foreignAgencyNames.push({ label: resp.value, value: resp.code })
        }
        this.showSpinner = false;
      }
    },
    (error) => {
      console.log('Request failed with error');
      this.showSpinner = false;
    })
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
    }
    //@ToDo
    //Check error in adddays
    //Service Integration and seq id count update
  }
}
