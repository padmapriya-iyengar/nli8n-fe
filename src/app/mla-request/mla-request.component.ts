import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as _ from 'lodash';
import { MLA_REQUEST } from '../entities/mla-request';
import { UtilityService } from '../commons/utilities.service';
import { DatePipe } from '@angular/common';

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

  constructor(private utilService: UtilityService, private datePipe: DatePipe) { }

  @ViewChild('mlaRequestForm') reqForm!: NgForm;
  @Output() reqSubmit = new EventEmitter<any>();
  @Input() modalSubmit: boolean = false;
  cmplxTimeMap: Map<string, number> = new Map<string, number>();

  ngOnInit(): void {
    this.formSubmitted = false;
    this.mlaRequest = new MLA_REQUEST();
    this.getSecurityClassifications();
    this.getRequestStatus();
    this.getRequestComplexity();
    this.getRequestTypes();
    this.getRequestModes();
    this.getRequestUrgency();
    this.getLocalAgencyTypes();
    this.getAGItemID();
    this.getFileOrigins();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['modalSubmit'].currentValue) {
      this.onSubmit()
    }
  }
  getSecurityClassifications() {
    this.secClassification = [];
    let response = {"CodeTables":[{"CodeTables-id":{"Id":"387436","ItemId":"002248573547A1ECA03AED61BD366817.387436"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":null,"I_TB_ParentCode":null,"Code":"EAT_BFRIPO","Name":"BFR IP Outcome","Category":"EXTERNAL_AGENCY_TYPE","Status":"A","CodeId":"1216","Title":{"Value":"CODE-000028337"}},{"CodeTables-id":{"Id":"387437","ItemId":"002248573547A1ECA03AED61BD366817.387437"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":null,"I_TB_ParentCode":null,"Code":"EAT_BC","Name":"Board/ Council","Category":"EXTERNAL_AGENCY_TYPE","Status":"A","CodeId":"1217","Title":{"Value":"CODE-000028338"}},{"CodeTables-id":{"Id":"387438","ItemId":"002248573547A1ECA03AED61BD366817.387438"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":null,"I_TB_ParentCode":null,"Code":"EAT_CO","Name":"Country","Category":"EXTERNAL_AGENCY_TYPE","Status":"A","CodeId":"1218","Title":{"Value":"CODE-000028339"}},{"CodeTables-id":{"Id":"387439","ItemId":"002248573547A1ECA03AED61BD366817.387439"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":null,"I_TB_ParentCode":null,"Code":"EAT_EA","Name":"Enforcement Agency","Category":"EXTERNAL_AGENCY_TYPE","Status":"A","CodeId":"1219","Title":{"Value":"CODE-000028340"}}]}
    this.getMasterDataSuccessHandler(response,'SECURITY_CLASSIFICATION')
  }
  getRequestStatus() {
    this.reqStatus = [];
    let response = {"CodeTables":[{"CodeTables-id":{"Id":"389388","ItemId":"002248573547A1ECA03AED61BD366817.389388"},"DisplayOrder":"3","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"ASSIGNED","I_TB_ParentCode":null,"Code":"RSTAT_A","Name":"Assigned","Category":"REQUEST_STATUS","Status":"A","CodeId":"3082","Title":{"Value":"CODE-000030289"}},{"CodeTables-id":{"Id":"458753","ItemId":"002248573547A1ECA03AED61BD366817.458753"},"DisplayOrder":null,"IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"BACKCAPTURE","I_TB_ParentCode":null,"Code":"RSTAT_BC","Name":"Back Capture","Category":"REQUEST_STATUS","Status":"A","CodeId":"99999","Title":{"Value":"CODE-000031800"}},{"CodeTables-id":{"Id":"389641","ItemId":"002248573547A1ECA03AED61BD366817.389641"},"DisplayOrder":"101","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"CIV","I_TB_ParentCode":null,"Code":"RSTAT_CV","Name":"Close in view","Category":"REQUEST_STATUS","Status":"A","CodeId":"3301","Title":{"Value":"CODE-000030542"}},{"CodeTables-id":{"Id":"389391","ItemId":"002248573547A1ECA03AED61BD366817.389391"},"DisplayOrder":"5","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"CLOSED","I_TB_ParentCode":null,"Code":"RSTAT_C","Name":"Closed","Category":"REQUEST_STATUS","Status":"A","CodeId":"3085","Title":{"Value":"CODE-000030292"}},{"CodeTables-id":{"Id":"389390","ItemId":"002248573547A1ECA03AED61BD366817.389390"},"DisplayOrder":"4","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"COMPLETE","I_TB_ParentCode":null,"Code":"RSTAT_CO","Name":"Completed","Category":"REQUEST_STATUS","Status":"A","CodeId":"3084","Title":{"Value":"CODE-000030291"}},{"CodeTables-id":{"Id":"389640","ItemId":"002248573547A1ECA03AED61BD366817.389640"},"DisplayOrder":"100","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"DISCARDED","I_TB_ParentCode":null,"Code":"RSTAT_D","Name":"Discarded","Category":"REQUEST_STATUS","Status":"A","CodeId":"3300","Title":{"Value":"CODE-000030541"}},{"CodeTables-id":{"Id":"389385","ItemId":"002248573547A1ECA03AED61BD366817.389385"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"INPROGRESS","I_TB_ParentCode":null,"Code":"RSTAT_I","Name":"In-Progress","Category":"REQUEST_STATUS","Status":"A","CodeId":"3079","Title":{"Value":"CODE-000030286"}},{"CodeTables-id":{"Id":"389392","ItemId":"002248573547A1ECA03AED61BD366817.389392"},"DisplayOrder":"6","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"KIV","I_TB_ParentCode":null,"Code":"RSTAT_K","Name":"Kiv","Category":"REQUEST_STATUS","Status":"A","CodeId":"3086","Title":{"Value":"CODE-000030293"}},{"CodeTables-id":{"Id":"389386","ItemId":"002248573547A1ECA03AED61BD366817.389386"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"OPEN","I_TB_ParentCode":null,"Code":"RSTAT_O","Name":"Open","Category":"REQUEST_STATUS","Status":"A","CodeId":"3080","Title":{"Value":"CODE-000030287"}},{"CodeTables-id":{"Id":"389387","ItemId":"002248573547A1ECA03AED61BD366817.389387"},"DisplayOrder":"2","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"PENDASSIGN","I_TB_ParentCode":null,"Code":"RSTAT_P","Name":"Pending Assignment","Category":"REQUEST_STATUS","Status":"A","CodeId":"3081","Title":{"Value":"CODE-000030288"}},{"CodeTables-id":{"Id":"389389","ItemId":"002248573547A1ECA03AED61BD366817.389389"},"DisplayOrder":"3","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"PENDASSCFILE","I_TB_ParentCode":null,"Code":"RSTAT_PF","Name":"Pending Associate File","Category":"REQUEST_STATUS","Status":"A","CodeId":"3083","Title":{"Value":"CODE-000030290"}}]}
    this.getMasterDataSuccessHandler(response,'REQUEST_STATUS')
  }
  getRequestComplexity() {
    this.reqCmplxts = [];
    let response = {"CodeTables":[{"CodeTables-id":{"Id":"389644","ItemId":"002248573547A1ECA03AED61BD366817.389644"},"DisplayOrder":"2","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"14","I_TB_ParentCode":null,"Code":"RCOMPLEX_C","Name":"Complex","Category":"REQUEST_COMPLEXITY","Status":"A","CodeId":"3303","Title":{"Value":"CODE-000030545"}},{"CodeTables-id":{"Id":"389647","ItemId":"002248573547A1ECA03AED61BD366817.389647"},"DisplayOrder":"5","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"56","I_TB_ParentCode":null,"Code":"RCOMPLEX_BSG","Name":"Exceptional Bills/SLs","Category":"REQUEST_COMPLEXITY","Status":"A","CodeId":"3306","Title":{"Value":"CODE-000030548"}},{"CodeTables-id":{"Id":"389646","ItemId":"002248573547A1ECA03AED61BD366817.389646"},"DisplayOrder":"4","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"28","I_TB_ParentCode":null,"Code":"RCOMPLEX_EX","Name":"Exceptional/Legislative Consultation","Category":"REQUEST_COMPLEXITY","Status":"A","CodeId":"3305","Title":{"Value":"CODE-000030547"}},{"CodeTables-id":{"Id":"389645","ItemId":"002248573547A1ECA03AED61BD366817.389645"},"DisplayOrder":"3","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"21","I_TB_ParentCode":null,"Code":"RCOMPLEX_EC","Name":"Extremely Complex","Category":"REQUEST_COMPLEXITY","Status":"A","CodeId":"3304","Title":{"Value":"CODE-000030546"}},{"CodeTables-id":{"Id":"389643","ItemId":"002248573547A1ECA03AED61BD366817.389643"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"7","I_TB_ParentCode":null,"Code":"RCOMPLEX_S","Name":"Simple","Category":"REQUEST_COMPLEXITY","Status":"A","CodeId":"3302","Title":{"Value":"CODE-000030544"}},{"CodeTables-id":{"Id":"389648","ItemId":"002248573547A1ECA03AED61BD366817.389648"},"DisplayOrder":"6","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"60","I_TB_ParentCode":null,"Code":"RCOMPLEX_SC","Name":"Special Category","Category":"REQUEST_COMPLEXITY","Status":"A","CodeId":"3307","Title":{"Value":"CODE-000030549"}}]}
    this.getMasterDataSuccessHandler(response,'REQUEST_COMPLEXITY')
  }
  getRequestTypes() {
    this.reqType = [];
    let response = {"CodeTables":[{"CodeTables-id":{"Id":"389686","ItemId":"002248573547A1ECA03AED61BD366817.389686"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":"3329","AlternateKey":null,"I_TB_ParentCode":"WF_ADV","Code":"RTYPE_ADV","Name":"Advisory","Category":"REQUEST_TYPE","Status":"A","CodeId":"3337","Title":{"Value":"CODE-000030587"}},{"CodeTables-id":{"Id":"389687","ItemId":"002248573547A1ECA03AED61BD366817.389687"},"DisplayOrder":"2","IsMigrated":"true","I_TB_ParentID":"3329","AlternateKey":null,"I_TB_ParentCode":"WF_ADV","Code":"RTYPE_BILL","Name":"Bill","Category":"REQUEST_TYPE","Status":"A","CodeId":"3338","Title":{"Value":"CODE-000030588"}},{"CodeTables-id":{"Id":"389688","ItemId":"002248573547A1ECA03AED61BD366817.389688"},"DisplayOrder":"3","IsMigrated":"true","I_TB_ParentID":"3329","AlternateKey":null,"I_TB_ParentCode":"WF_ADV","Code":"RTYPE_SL","Name":"Subsidiary Legislation","Category":"REQUEST_TYPE","Status":"A","CodeId":"3339","Title":{"Value":"CODE-000030589"}},{"CodeTables-id":{"Id":"389689","ItemId":"002248573547A1ECA03AED61BD366817.389689"},"DisplayOrder":"4","IsMigrated":"true","I_TB_ParentID":"3329","AlternateKey":null,"I_TB_ParentCode":"WF_ADV","Code":"RTYPE_LA","Name":"Law Revision (Acts)","Category":"REQUEST_TYPE","Status":"A","CodeId":"3340","Title":{"Value":"CODE-000030590"}},{"CodeTables-id":{"Id":"389690","ItemId":"002248573547A1ECA03AED61BD366817.389690"},"DisplayOrder":"5","IsMigrated":"true","I_TB_ParentID":"3329","AlternateKey":null,"I_TB_ParentCode":"WF_ADV","Code":"RTYPE_LS","Name":"Law Revision (SL)","Category":"REQUEST_TYPE","Status":"A","CodeId":"3341","Title":{"Value":"CODE-000030591"}},{"CodeTables-id":{"Id":"389691","ItemId":"002248573547A1ECA03AED61BD366817.389691"},"DisplayOrder":"6","IsMigrated":"true","I_TB_ParentID":"3329","AlternateKey":null,"I_TB_ParentCode":"WF_ADV","Code":"RTYPE_FIAT","Name":"FIAT","Category":"REQUEST_TYPE","Status":"A","CodeId":"3342","Title":{"Value":"CODE-000030592"}},{"CodeTables-id":{"Id":"389692","ItemId":"002248573547A1ECA03AED61BD366817.389692"},"DisplayOrder":"7","IsMigrated":"true","I_TB_ParentID":"3329","AlternateKey":null,"I_TB_ParentCode":"WF_ADV","Code":"RTYPE_TR","Name":"Transaction","Category":"REQUEST_TYPE","Status":"A","CodeId":"3343","Title":{"Value":"CODE-000030593"}},{"CodeTables-id":{"Id":"389693","ItemId":"002248573547A1ECA03AED61BD366817.389693"},"DisplayOrder":"8","IsMigrated":"true","I_TB_ParentID":"3329","AlternateKey":null,"I_TB_ParentCode":"WF_ADV","Code":"RTYPE_AAS","Name":"AAS","Category":"REQUEST_TYPE","Status":"A","CodeId":"3344","Title":{"Value":"CODE-000030594"}},{"CodeTables-id":{"Id":"389694","ItemId":"002248573547A1ECA03AED61BD366817.389694"},"DisplayOrder":"9","IsMigrated":"true","I_TB_ParentID":"3329","AlternateKey":null,"I_TB_ParentCode":"WF_ADV","Code":"RTYPE_DM","Name":"DM & Routine","Category":"REQUEST_TYPE","Status":"A","CodeId":"3345","Title":{"Value":"CODE-000030595"}},{"CodeTables-id":{"Id":"389695","ItemId":"002248573547A1ECA03AED61BD366817.389695"},"DisplayOrder":"10","IsMigrated":"true","I_TB_ParentID":"3329","AlternateKey":null,"I_TB_ParentCode":"WF_ADV","Code":"RTYPE_LIT","Name":"Litigation","Category":"REQUEST_TYPE","Status":"A","CodeId":"3346","Title":{"Value":"CODE-000030596"}},{"CodeTables-id":{"Id":"389696","ItemId":"002248573547A1ECA03AED61BD366817.389696"},"DisplayOrder":"11","IsMigrated":"true","I_TB_ParentID":"3329","AlternateKey":null,"I_TB_ParentCode":"WF_ADV","Code":"RTYPE_ALB","Name":"ADM & Legal Branch","Category":"REQUEST_TYPE","Status":"A","CodeId":"3347","Title":{"Value":"CODE-000030597"}},{"CodeTables-id":{"Id":"389697","ItemId":"002248573547A1ECA03AED61BD366817.389697"},"DisplayOrder":"12","IsMigrated":"true","I_TB_ParentID":"3329","AlternateKey":null,"I_TB_ParentCode":"WF_ADV","Code":"RTYPE_LLPS","Name":"LLPS","Category":"REQUEST_TYPE","Status":"A","CodeId":"3348","Title":{"Value":"CODE-000030598"}},{"CodeTables-id":{"Id":"389698","ItemId":"002248573547A1ECA03AED61BD366817.389698"},"DisplayOrder":"13","IsMigrated":"true","I_TB_ParentID":"3329","AlternateKey":null,"I_TB_ParentCode":"WF_ADV","Code":"RTYPE_LPS","Name":"LPS","Category":"REQUEST_TYPE","Status":"A","CodeId":"3349","Title":{"Value":"CODE-000030599"}}]}
    this.getMasterDataSuccessHandler(response,'REQUEST_TYPE')
  }
  getRequestModes() {
    this.reqModes = [];
    let response = {"CodeTables":[{"CodeTables-id":{"Id":"389378","ItemId":"002248573547A1ECA03AED61BD366817.389378"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"EMAIL","I_TB_ParentCode":null,"Code":"RMODE_E","Name":"By Email","Category":"REQUEST_MODE","Status":"A","CodeId":"3073","Title":{"Value":"CODE-000030279"}},{"CodeTables-id":{"Id":"389379","ItemId":"002248573547A1ECA03AED61BD366817.389379"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"FAX","I_TB_ParentCode":null,"Code":"RMODE_F","Name":"By Fax","Category":"REQUEST_MODE","Status":"A","CodeId":"3074","Title":{"Value":"CODE-000030280"}},{"CodeTables-id":{"Id":"389380","ItemId":"002248573547A1ECA03AED61BD366817.389380"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"HAND","I_TB_ParentCode":null,"Code":"RMODE_H","Name":"By Hand","Category":"REQUEST_MODE","Status":"A","CodeId":"3075","Title":{"Value":"CODE-000030281"}},{"CodeTables-id":{"Id":"389381","ItemId":"002248573547A1ECA03AED61BD366817.389381"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"POST","I_TB_ParentCode":null,"Code":"RMODE_P","Name":"By Post","Category":"REQUEST_MODE","Status":"A","CodeId":"3076","Title":{"Value":"CODE-000030282"}},{"CodeTables-id":{"Id":"389382","ItemId":"002248573547A1ECA03AED61BD366817.389382"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"WEB","I_TB_ParentCode":null,"Code":"RMODE_W","Name":"By Web Request Submission","Category":"REQUEST_MODE","Status":"A","CodeId":"3077","Title":{"Value":"CODE-000030283"}},{"CodeTables-id":{"Id":"389383","ItemId":"002248573547A1ECA03AED61BD366817.389383"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"INTERNAL","I_TB_ParentCode":null,"Code":"RMODE_I","Name":"Internal","Category":"REQUEST_MODE","Status":"A","CodeId":"3078","Title":{"Value":"CODE-000030284"}}]}
    this.getMasterDataSuccessHandler(response,'REQUEST_MODE')
  }
  getRequestUrgency() {
    this.reqUrgency = [];
    let response = {"CodeTables":[{"CodeTables-id":{"Id":"389650","ItemId":"002248573547A1ECA03AED61BD366817.389650"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"NU","I_TB_ParentCode":null,"Code":"RURGENT_NU","Name":"Not Urgent","Category":"REQUEST_URGENCY","Status":"A","CodeId":"3308","Title":{"Value":"CODE-000030551"}},{"CodeTables-id":{"Id":"389651","ItemId":"002248573547A1ECA03AED61BD366817.389651"},"DisplayOrder":"2","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"U","I_TB_ParentCode":null,"Code":"RURGENT_U","Name":"Urgent (!)","Category":"REQUEST_URGENCY","Status":"A","CodeId":"3309","Title":{"Value":"CODE-000030552"}},{"CodeTables-id":{"Id":"389652","ItemId":"002248573547A1ECA03AED61BD366817.389652"},"DisplayOrder":"3","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"VU","I_TB_ParentCode":null,"Code":"RURGENT_VU","Name":"Very Urgent (!!)","Category":"REQUEST_URGENCY","Status":"A","CodeId":"3310","Title":{"Value":"CODE-000030553"}}]}
    this.getMasterDataSuccessHandler(response,'REQUEST_URGENCY')
  }
  getLocalAgencyTypes() {
    this.reqLocalAgencyTypes = [];
    let response = {"CodeTables":[{"CodeTables-id":{"Id":"389463","ItemId":"002248573547A1ECA03AED61BD366817.389463"},"DisplayOrder":"2","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"C","I_TB_ParentCode":null,"Code":"SCLASS_C","Name":"Confidential","Category":"SECURITY_CLASSIFICATION","Status":"A","CodeId":"3149","Title":{"Value":"CODE-000030364"}},{"CodeTables-id":{"Id":"389464","ItemId":"002248573547A1ECA03AED61BD366817.389464"},"DisplayOrder":"3","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"R","I_TB_ParentCode":null,"Code":"SCLASS_R","Name":"Restricted","Category":"SECURITY_CLASSIFICATION","Status":"A","CodeId":"3150","Title":{"Value":"CODE-000030365"}},{"CodeTables-id":{"Id":"389462","ItemId":"002248573547A1ECA03AED61BD366817.389462"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"S","I_TB_ParentCode":null,"Code":"SCLASS_S","Name":"Secret","Category":"SECURITY_CLASSIFICATION","Status":"A","CodeId":"3148","Title":{"Value":"CODE-000030363"}}]}
    this.getMasterDataSuccessHandler(response,'EXTERNAL_AGENCY_TYPE')
  }
  getFileOrigins() {
    this.fileOrigin = [];
    this.fileOrigin = [
      { label: 'Local', value: 'ADDR_L' },
      { label: 'Foreign', value: 'ADDR_F' },
    ];
    this.mlaRequest.LocalForeign = 'ADDR_L'
  }
  getMasterDataSuccessHandler(response: any, type: any) {
    if (response.CodeTables) {
      if (response.CodeTables.length > 0) {
        if (type == 'SECURITY_CLASSIFICATION') {
          response.CodeTables.forEach((data: any) => {
            this.secClassification.push({ label: data.Name, value: data.Code })
          })
          this.mlaRequest.SecurityClassification = 'SCLASS_S'
        }
        if (type == 'REQUEST_STATUS') {
          response.CodeTables.forEach((data: any) => {
            this.reqStatus.push({ label: data.Name, value: data.Code });
          })
          this.mlaRequest.RequestStatus = 'RSTAT_O'
        }
        if (type == 'REQUEST_COMPLEXITY') {
          response.CodeTables.forEach((data: any) => {
            this.reqCmplxts.push({ label: data.Name + " (" + data.AlternateKey + " days)", value: data.Code });
            this.cmplxTimeMap.set(data.Code, data.AlternateKey);
          })
        }
        if (type == 'REQUEST_TYPE') {
          response.CodeTables.forEach((data: any) => {
            this.reqType.push({ label: data.Name, value: data.Code });
          })
        }
        if (type == 'REQUEST_MODE') {
          response.CodeTables.forEach((data: any) => {
            this.reqModes.push({ label: data.Name, value: data.Code });
          })
        }
        if (type == 'REQUEST_URGENCY') {
          response.CodeTables.forEach((data: any) => {
            this.reqUrgency.push({ label: data.Name, value: data.Code });
          })
          this.mlaRequest.Urgency = 'RURGENT_NU'
        }
        if (type == 'COUNTRY') {
          response.CodeTables.forEach((data: any) => {
            this.foreignCountries.push({ label: data.Name, value: data.Code })
            this.foreignAgencyCountryCodeIDMap.set(data.Code, data.CodeId);
          })
        }
        if (type == 'AGENCY_TYPE_FOREIGN') {
          response.CodeTables.forEach((data: any) => {
            this.foreignAgencyTypes.push({ label: data.Name, value: data.Code })
            this.foreignAgencyTypeCodeIDMap.set(data.Code, data.CodeId);
          })
        }
        if (type == 'EXTERNAL_AGENCY_TYPE') {
          response.CodeTables.forEach((data: any) => {
            this.reqLocalAgencyTypes.push({ label: data.Name, value: data.Code })
            this.localAgencyTypeCodeIDMap.set(data.Code, data.CodeId);
          })
        }
      }
      else if (!response.CodeTables.length) {
        let data = response.CodeTables;
        if (type == 'SECURITY_CLASSIFICATION') {
          this.secClassification.push({ label: data.Name, value: data.Code })
          this.mlaRequest.SecurityClassification = 'SCLASS_S'
        }
        if (type == 'REQUEST_STATUS') {
          this.reqStatus.push({ label: data.Name, value: data.Code });
          this.mlaRequest.RequestStatus = 'RSTAT_O'
        }
        if (type == 'REQUEST_COMPLEXITY') {
          this.reqCmplxts.push({ label: data.Name, value: data.Code })
          this.cmplxTimeMap.set(data.Code, data.AlternateKey);
        }
        if (type == 'REQUEST_TYPE') {
          this.reqType.push({ label: data.Name, value: data.Code });
        }
        if (type == 'REQUEST_MODE') {
          this.reqModes.push({ label: data.Name, value: data.Code });
        }
        if (type == 'REQUEST_URGENCY') {
          this.reqUrgency.push({ label: data.Name, value: data.Code });
          this.mlaRequest.Urgency = 'RURGENT_NU'
        }
        if (type == 'COUNTRY') {
          this.foreignCountries.push({ label: data.Name, value: data.Code })
          this.foreignAgencyCountryCodeIDMap.set(data.Code, data.CodeId);
        }
        if (type == 'AGENCY_TYPE_FOREIGN') {
          this.foreignAgencyTypes.push({ label: data.Name, value: data.Code })
          this.foreignAgencyTypeCodeIDMap.set(data.Code, data.CodeId);
        }
        if (type == 'EXTERNAL_AGENCY_TYPE') {
          this.reqLocalAgencyTypes.push({ label: data.Name, value: data.Code })
          this.localAgencyTypeCodeIDMap.set(data.Code, data.CodeId);
        }
      }
    }
    if (response.Agency) {
      if (response.Agency.length > 0) {
        if (type == 'EXTERNAL_AGENCY_NAME') {
          response.Agency.forEach((data: any) => {
            this.reqLocalAgencyNames.push({ label: data.Description, value: data.AgencyCode })
          })
        }
        if (type == 'AGENCY_NAME_FOREIGN') {
          response.Agency.forEach((data: any) => {
            this.foreignAgencyNames.push({ label: data.Description, value: data.AgencyCode })
          })
        }
      }
      else if (!response.Agency) {
        let data = response.Agency;
        if (type == 'EXTERNAL_AGENCY_NAME') {
          this.reqLocalAgencyNames.push({ label: data.Description, value: data.AgencyCode })
        }
        if (type == 'AGENCY_NAME_FOREIGN') {
          this.foreignAgencyNames.push({ label: data.Description, value: data.AgencyCode })
        }
      }
    }
  }
  getAGItemID() {
    let response = {"FileRefNoFormat":{"ChildType":"V_PS_CM_DIVISION","MetadataCategory":null,"I_IW_ParentId":null,"WorkOnMatterIndicator":"N","I_RefNoDN":null,"IsMigrated":null,"I_ParentItemID":null,"I_IW_ID":"1","Status":"A","I_ChildDescription":null,"I_FileType":null,"FormatID":"100001","I_ChildType":"CUSTOM","BFRComplexity":null,"RetentionPeriodType":null,"Description":"Attorney-General","ReferenceNoDN":"AG","I_ChildCode":null,"FileType":null,"RetentionPeriodValue":null,"Code":"AG","FileRefNoFormat-id":{"Id":"294915","ItemId":"002248573547A1ECA330FA604440E819.294915"},"Title":{"Value":"AG","@xmlns":"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0","@xmlns:wstxns3":"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0"},"@xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","@xmlns:wstxns1":"http://schemas/AGCSIWMasterData/FileRefNoFormat/operations","@xmlns":"http://schemas/AGCSIWMasterData/FileRefNoFormat","@xmlns:wstxns2":"http://schemas/AGCSIWMasterData/FileRefNoFormat"},"@xmlns:wstxns1":"http://schemas/AGCSIWMasterData/FileRefNoFormat/operations","@xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance"}
    let resp = response.FileRefNoFormat
    if (resp) {
      this.getDivisions(resp['FileRefNoFormat-id']['ItemId'])
    }
  }
  getDivisions(agItemID: string) {
    this.allDivisions = [];
    let response = {"FileRefNoFormat":[{"ParentCode":{"FileRefNoFormat-id":{"Id":"294915","ItemId":"002248573547A1ECA330FA604440E819.294915"}},"Title":{"Value":"ADM"},"ChildType":"CUSTOM","MetadataCategory":null,"I_IW_ParentId":"1","WorkOnMatterIndicator":"N","I_RefNoDN":null,"IsMigrated":null,"I_ParentItemID":null,"I_IW_ID":"10","Status":"I","I_ChildDescription":null,"I_FileType":null,"FormatID":"100002","I_ChildType":"CUSTOM","BFRComplexity":null,"RetentionPeriodType":null,"Description":"ADM","ReferenceNoDN":"AG/ADM","I_ChildCode":null,"FileType":null,"RetentionPeriodValue":null,"Code":"ADM","FileRefNoFormat-id":{"Id":"294913","ItemId":"002248573547A1ECA330FA604440E819.294913"}},{"ParentCode":{"FileRefNoFormat-id":{"Id":"294915","ItemId":"002248573547A1ECA330FA604440E819.294915"}},"Title":{"Value":"FTCD"},"ChildType":"CUSTOM","MetadataCategory":null,"I_IW_ParentId":"1","WorkOnMatterIndicator":"N","I_RefNoDN":null,"IsMigrated":null,"I_ParentItemID":null,"I_IW_ID":"5","Status":"A","I_ChildDescription":null,"I_FileType":null,"FormatID":"2479","I_ChildType":"CUSTOM","BFRComplexity":null,"RetentionPeriodType":null,"Description":"Financial and Technology Crime Division","ReferenceNoDN":"AG/FTCD","I_ChildCode":null,"FileType":null,"RetentionPeriodValue":null,"Code":"FTCD","FileRefNoFormat-id":{"Id":"294914","ItemId":"002248573547A1ECA330FA604440E819.294914"}},{"ParentCode":{"FileRefNoFormat-id":{"Id":"294915","ItemId":"002248573547A1ECA330FA604440E819.294915"}},"Title":{"Value":"CJFS"},"ChildType":"CUSTOM","MetadataCategory":null,"I_IW_ParentId":"1","WorkOnMatterIndicator":"N","I_RefNoDN":null,"IsMigrated":null,"I_ParentItemID":null,"I_IW_ID":"15","Status":"I","I_ChildDescription":null,"I_FileType":null,"FormatID":"102324","I_ChildType":"CUSTOM","BFRComplexity":null,"RetentionPeriodType":null,"Description":"CJFS","ReferenceNoDN":"AG/CJFS","I_ChildCode":null,"FileType":null,"RetentionPeriodValue":null,"Code":"CJFS","FileRefNoFormat-id":{"Id":"294916","ItemId":"002248573547A1ECA330FA604440E819.294916"}},{"ParentCode":{"FileRefNoFormat-id":{"Id":"294915","ItemId":"002248573547A1ECA330FA604440E819.294915"}},"Title":{"Value":"LPS"},"ChildType":"CUSTOM","MetadataCategory":null,"I_IW_ParentId":"1","WorkOnMatterIndicator":"N","I_RefNoDN":null,"IsMigrated":null,"I_ParentItemID":null,"I_IW_ID":"2","Status":"A","I_ChildDescription":null,"I_FileType":null,"FormatID":"1308","I_ChildType":"CUSTOM","BFRComplexity":null,"RetentionPeriodType":null,"Description":"LPS","ReferenceNoDN":"AG/LPS","I_ChildCode":null,"FileType":null,"RetentionPeriodValue":null,"Code":"LPS","FileRefNoFormat-id":{"Id":"294917","ItemId":"002248573547A1ECA330FA604440E819.294917"}}]}
    let resp = response.FileRefNoFormat;
    if (resp) {
      resp.forEach((child: any) => {
        this.allDivisions.push({ label: child.Description, value: child.Code })
      })
      this.getCurrentUserFileDivisions();
    }
  }
  getCurrentUserFileDivisions() {
    this.reqDivisions = [];
    let response = {"Groups":{"FunctionalGroup":{"FunctionalGroup-id":{"Id":"49155","ItemId":"002248573547A1ECA0C26352C534A817.49155"},"GroupName":"IAD","GroupCreatedInOTDS":"Yes","IsDivision":"true","IsChild":"No","GroupDescription":"International Affairs Division","GroupType":"Functional","UserLinkedToGroup":{"@nil":"true"},"Status":"A","Title":{"Value":"IAD"}}}}
    if (response.Groups) {
      let resp = response.Groups.FunctionalGroup;
      let index = _.findIndex(this.allDivisions, function (fg: any) { return fg.value == resp.Title.Value; })
        if (index != -1) {
          this.reqDivisions.push({ label: resp.GroupDescription, value: resp.Title.Value })
        }
    }
  }
  onComplexityChange(data: any) {
    let days: any;
    if (this.mlaRequest.ReceivedDate) {
      days = this.cmplxTimeMap.get(data.value);
    }
  }
  onReceivedDateChange(data: any) {
    let days: any;
    if (!this.utilService.isEmpty(this.mlaRequest.Complexity)) {
      days = this.cmplxTimeMap.get(this.mlaRequest.Complexity);
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
    let response = {"CodeTables":[{"CodeTables-id":{"Id":"386568","ItemId":"002248573547A1ECA03AED61BD366817.386568"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"AF","I_TB_ParentCode":null,"Code":"CTRY_AF","Name":"AFGHANISTAN","Category":"COUNTRY","Status":"A","CodeId":"366","Title":{"Value":"CODE-000027469"}},{"CodeTables-id":{"Id":"386569","ItemId":"002248573547A1ECA03AED61BD366817.386569"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"AX","I_TB_ParentCode":null,"Code":"CTRY_AX","Name":"ALAND ISLANDS","Category":"COUNTRY","Status":"A","CodeId":"367","Title":{"Value":"CODE-000027470"}},{"CodeTables-id":{"Id":"386570","ItemId":"002248573547A1ECA03AED61BD366817.386570"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"AL","I_TB_ParentCode":null,"Code":"CTRY_AL","Name":"ALBANIA","Category":"COUNTRY","Status":"A","CodeId":"368","Title":{"Value":"CODE-000027471"}},{"CodeTables-id":{"Id":"386571","ItemId":"002248573547A1ECA03AED61BD366817.386571"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"DZ","I_TB_ParentCode":null,"Code":"CTRY_DZ","Name":"ALGERIA","Category":"COUNTRY","Status":"A","CodeId":"369","Title":{"Value":"CODE-000027472"}},{"CodeTables-id":{"Id":"386572","ItemId":"002248573547A1ECA03AED61BD366817.386572"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"AS","I_TB_ParentCode":null,"Code":"CTRY_AS","Name":"AMERICAN SAMOA","Category":"COUNTRY","Status":"A","CodeId":"370","Title":{"Value":"CODE-000027473"}}]}
    this.getMasterDataSuccessHandler(response,'COUNTRY')
  }
  getForeignAgencyTypes(countryCodeID: any) {
    this.foreignAgencyTypes = [];
    this.foreignAgencyNames = [];
    let response = {"CodeTables":[{"CodeTables-id":{"Id":"389913","ItemId":"002248573547A1ECA03AED61BD366817.389913"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":"379","AlternateKey":"AU","I_TB_ParentCode":"CTRY_AU","Code":"ATF_AUM","Name":"Ministry","Category":"AGENCY_TYPE_FOREIGN","Status":"A","CodeId":"3558","Title":{"Value":"CODE-000030814"}},{"CodeTables-id":{"Id":"389914","ItemId":"002248573547A1ECA03AED61BD366817.389914"},"DisplayOrder":"2","IsMigrated":"true","I_TB_ParentID":"379","AlternateKey":"AU","I_TB_ParentCode":"CTRY_AU","Code":"ATF_AUJ","Name":"Judiciary","Category":"AGENCY_TYPE_FOREIGN","Status":"A","CodeId":"3559","Title":{"Value":"CODE-000030815"}},{"CodeTables-id":{"Id":"389915","ItemId":"002248573547A1ECA03AED61BD366817.389915"},"DisplayOrder":"3","IsMigrated":"true","I_TB_ParentID":"379","AlternateKey":"AU","I_TB_ParentCode":"CTRY_AU","Code":"ATF_AULE","Name":"Law Enforcement","Category":"AGENCY_TYPE_FOREIGN","Status":"A","CodeId":"3560","Title":{"Value":"CODE-000030816"}}]}
    this.getMasterDataSuccessHandler(response,'AGENCY_TYPE_FOREIGN')
  }
  onLocalAgencyTypeChange(data: any) {
    this.reqLocalAgencyNames = [];
    let response = {"Agency":[{"AgencyTypeCode":"EAT_EA","Description":"(OLD) CRIME REGISTRY 2","BuildingName":null,"BlockNo":null,"CountryCode":"CTRY_SG","IsMigrated":null,"AgencyCode":"CB","AddressTypeCode":"ADDR_L","UnitNo":null,"UnFormatAddress":null,"PostalCode":null,"I_TB_ID":"1219","TelephoneNo":null,"StreetName":null,"Status":"A","LevelNo":null,"I_Agency_ID":"45","Agency-id":{"Id":"73752","ItemId":"002248573547A1ECA3CADFEDA165A81A.73752"}},{"AgencyTypeCode":"EAT_EA","Description":"AGENCY ABC","BuildingName":null,"BlockNo":null,"CountryCode":null,"IsMigrated":null,"AgencyCode":"ABC","AddressTypeCode":"ADDR_L","UnitNo":null,"UnFormatAddress":null,"PostalCode":null,"I_TB_ID":"1219","TelephoneNo":null,"StreetName":null,"Status":"A","LevelNo":null,"I_Agency_ID":"46","Agency-id":{"Id":"73754","ItemId":"002248573547A1ECA3CADFEDA165A81A.73754"}},{"AgencyTypeCode":"EAT_EA","Description":"(OLD) ANTI VICE","BuildingName":null,"BlockNo":null,"CountryCode":"CTRY_SG","IsMigrated":null,"AgencyCode":"AVT","AddressTypeCode":"ADDR_L","UnitNo":null,"UnFormatAddress":null,"PostalCode":null,"I_TB_ID":"1219","TelephoneNo":null,"StreetName":null,"Status":"A","LevelNo":null,"I_Agency_ID":"42","Agency-id":{"Id":"73755","ItemId":"002248573547A1ECA3CADFEDA165A81A.73755"}},{"AgencyTypeCode":"EAT_EA","Description":"AIRPORT POLICE","BuildingName":null,"BlockNo":null,"CountryCode":"CTRY_SG","IsMigrated":null,"AgencyCode":"AP","AddressTypeCode":"ADDR_L","UnitNo":null,"UnFormatAddress":null,"PostalCode":null,"I_TB_ID":"1219","TelephoneNo":null,"StreetName":null,"Status":"A","LevelNo":null,"I_Agency_ID":"47","Agency-id":{"Id":"73757","ItemId":"002248573547A1ECA3CADFEDA165A81A.73757"}},{"AgencyTypeCode":"EAT_EA","Description":"CENTRAL POLICE DIVISION HEADQUARTERS","BuildingName":null,"BlockNo":null,"CountryCode":"CTRY_SG","IsMigrated":null,"AgencyCode":"A","AddressTypeCode":"ADDR_L","UnitNo":null,"UnFormatAddress":null,"PostalCode":null,"I_TB_ID":"1219","TelephoneNo":null,"StreetName":null,"Status":"A","LevelNo":null,"I_Agency_ID":"55","Agency-id":{"Id":"73758","ItemId":"002248573547A1ECA3CADFEDA165A81A.73758"}}]}
    this.getMasterDataSuccessHandler(response,'EXTERNAL_AGENCY_NAME')
  }
  onForeignAgencyTypeChange(data: any) {
    this.foreignAgencyNames = [];
    let response = {"Agency":[{"AgencyTypeCode":"ATF_AUM","Description":"Department of Foreign Affairs and Trade","BuildingName":null,"BlockNo":null,"CountryCode":"CTRY_AU","IsMigrated":null,"AgencyCode":"AU_FA","AddressTypeCode":"ADDR_F","UnitNo":null,"UnFormatAddress":null,"PostalCode":null,"I_TB_ID":"3558","TelephoneNo":null,"StreetName":null,"Status":"A","LevelNo":null,"I_Agency_ID":"8145","Agency-id":{"Id":"81852","ItemId":"002248573547A1ECA3CADFEDA165A81A.81852"}},{"AgencyTypeCode":"ATF_AUM","Description":"Attorney-General Department","BuildingName":null,"BlockNo":null,"CountryCode":"CTRY_AU","IsMigrated":null,"AgencyCode":"AU_AG","AddressTypeCode":"ADDR_F","UnitNo":null,"UnFormatAddress":null,"PostalCode":null,"I_TB_ID":"3558","TelephoneNo":null,"StreetName":null,"Status":"A","LevelNo":null,"I_Agency_ID":"8146","Agency-id":{"Id":"81856","ItemId":"002248573547A1ECA3CADFEDA165A81A.81856"}},{"AgencyTypeCode":"ATF_AUM","Description":"Ministry of Defence","BuildingName":null,"BlockNo":null,"CountryCode":"CTRY_AU","IsMigrated":null,"AgencyCode":"AU_MD","AddressTypeCode":"ADDR_F","UnitNo":null,"UnFormatAddress":null,"PostalCode":null,"I_TB_ID":"3558","TelephoneNo":null,"StreetName":null,"Status":"A","LevelNo":null,"I_Agency_ID":"8144","Agency-id":{"Id":"81857","ItemId":"002248573547A1ECA3CADFEDA165A81A.81857"}}]}
    this.getMasterDataSuccessHandler(response,'AGENCY_NAME_FOREIGN')
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
      mla_req.RequestCreatedBy = UtilityService.CURRENT_USER_NAME;
      mla_req.RequestCreatedDate = this.datePipe.transform(new Date(), "yyyy-MM-dd'T'hh:mm:ss");
    }
  }
}
