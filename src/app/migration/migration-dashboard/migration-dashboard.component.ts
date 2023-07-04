import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { UtilitiesService } from '../../commons/services/utilities.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import * as _ from 'lodash';

@Component({
  selector: 'migration-dashboard',
  templateUrl: './migration-dashboard.component.html',
  styleUrls: ['./migration-dashboard.component.scss']
})
export class MigrationDashboardComponent implements OnInit {
  constructor(private utilService: UtilitiesService, private modalService: BsModalService,
    private datePipe: DatePipe, private confirmationService: ConfirmationService) { }
  
  modalRef!: BsModalRef;
  serviceTitle!: string;
  serviceURL!: string;
  servIdentifier: string = 'CONSOLIDATED_REPORT';
  isReqSubmitted!: boolean;
  allServiceList: any[] = [];
  accordionServiceList: any[] = [];
  buttonServiceList: any[] = [];  
  servicesPresent: boolean = true;
  breadcrumbMenu: MenuItem[] = [];
  fileDetails: any = {};
  rowDetails: any = {};
  clearMenu: boolean = false;
  fileSource: string = "";

  ngOnInit(): void {
    this.getLoggedInUserDetails();
    this.getMenuConfig();
    this.utilService.dashboardServ.subscribe(serv => {
      this.servIdentifier = serv;
    })
    this.utilService.pushToMenu.subscribe(menuInfo => {
      this.pushToBreadcrumb(menuInfo.label, menuInfo.icon, menuInfo.routerLink, menuInfo.queryParams, menuInfo.commandType, menuInfo.commandDesc, menuInfo.styleClass)
    })
    this.utilService.clearMenu.subscribe(info => {
      this.breadcrumbMenu = [];
    })
    this.utilService.fileDetails.subscribe(fileInfo => {
      this.fileDetails = fileInfo;
    })
    this.utilService.rowDetails.subscribe(rowInfo => {
      this.rowDetails = rowInfo;
    })
    this.utilService.fileSource.subscribe(source => {
      this.fileSource = source.FILE_SOURCE;
    })
  }
  loadUserProfile() {
    if (!UtilitiesService.IS_USER_PROFILE_TRIGGERED) {
      //Service Implementation
      let response = {"UserProfile":{"InboxPreference":"[]","ContactNumber":{"@nil":"true"},"DisplayName":"Priya","OutOfOfficeMessage":{"@nil":"true"},"Name":"priya","DateFrom":{"@nil":"true"},"DepartmentName":"IAD","ReceiveEmailNotifications":"false","OutOfOffice":"false","LastUpdatedBy":"priya","LastUpdatedOn":"2022-05-24T17:15:48Z","UserID":"priya","DateUntil":{"@nil":"true"},"Email":{"@nil":"true"},"UserProfile-id":{"Id":"213008","ItemId":"002248573547A1ECA6E5D79B37C2E81A.213008"}},"FunctionalGroup":[{"FunctionalGroup-id":{"Id":"49155","ItemId":"002248573547A1ECA0C26352C534A817.49155"},"GroupName":"IAD","GroupCreatedInOTDS":"Yes","IsDivision":"true","IsChild":"No","GroupDescription":"International Affairs Division","GroupType":"Functional","UserLinkedToGroup":{"@nil":"true"},"Status":"A","Title":{"Value":"IAD"}},{"FunctionalGroup-id":{"Id":"180226","ItemId":"002248573547A1ECA0C26352C534A817.180226"},"GroupName":"Migration Data Admin","GroupCreatedInOTDS":"No","IsDivision":"false","IsChild":"Yes","GroupDescription":"Migration Data Admin","GroupType":"Functional","UserLinkedToGroup":"No","Status":"A","Title":{"Value":"Migration Data Admin"}},{"FunctionalGroup-id":{"Id":"1","ItemId":"002248573547A1ECA0C26352C534A817.1"},"GroupName":"AGC","GroupCreatedInOTDS":"Yes","IsDivision":"false","IsChild":"No","GroupDescription":"Attorney General Chambers","GroupType":"Functional","UserLinkedToGroup":{"@nil":"true"},"Status":"A","Title":{"Value":"AGC"}},{"FunctionalGroup-id":{"Id":"49156","ItemId":"002248573547A1ECA0C26352C534A817.49156"},"GroupName":"REGISTRY (IAD)","GroupCreatedInOTDS":"Yes","IsDivision":"false","IsChild":"Yes","GroupDescription":"Registry team of IAD","GroupType":"Functional","UserLinkedToGroup":{"@nil":"true"},"Status":"A","Title":{"Value":"REGISTRY (IAD)"}}]}
      let resp = response.UserProfile;
      UtilitiesService.CURRENT_USER_ITEM_ID = resp['UserProfile-id']['ItemId'];
      UtilitiesService.CURRENT_USER_INBOX_PREF = {"field":"TASK_ACTION","label":"Action","type":"string","spanWidth":"1","isSelected":true,"display":true,"spanWidthPx":"100"},{"field":"TASK_TITLE","label":"Title","type":"string","spanWidth":"2","isSelected":true,"display":true,"spanWidthPx":"200"},{"field":"FILE_TITLE","label":"File Title","type":"string","spanWidth":"1","isSelected":true,"display":true,"spanWidthPx":"200"},{"field":"FILE_REF_NO","label":"Ref No.","type":"string","spanWidth":"1","isSelected":true,"display":true,"spanWidthPx":"200"},{"field":"REQUEST_ID","label":"Req ID","type":"string","spanWidth":"1","isSelected":true,"display":true,"spanWidthPx":"100"},{"field":"DELIVERY_DATE","label":"Received Date","type":"datetime","spanWidth":"2","isSelected":true,"display":true,"spanWidthPx":"200"},{"field":"CIRCULATION_ID","label":"Circulation ID","type":"string","spanWidth":"2","isSelected":true,"display":true,"spanWidthPx":"200"},{"field":"REQUEST_DUE_DATE","label":"Due Date","type":"date","spanWidth":"2","isSelected":true,"display":true,"spanWidthPx":"200"},{"field":"EXPECTED_RESPONSE_DATE","label":"Expected Response Date","type":"date","spanWidth":"2","isSelected":true,"display":true,"spanWidthPx":"200"},{"field":"TASK_STATUS","label":"Status","type":"string","spanWidth":"1","isSelected":true,"display":true,"spanWidthPx":"100"},{"field":"TASK_FROM","label":"From","type":"string","spanWidth":"1","isSelected":true,"display":true,"spanWidthPx":"100"},{"field":"ACTION_OFFICER","label":"Action Officer","type":"string","spanWidth":"1","isSelected":true,"display":true,"spanWidthPx":"100"},{"field":"ASSIGNEE","label":"Locked By","type":"string","spanWidth":"1","isSelected":true,"display":true,"spanWidthPx":"100"},{"field":"LOCKED_TIME","label":"Locked Time","type":"string","spanWidth":"1","isSelected":true,"display":true,"spanWidthPx":"100"},{"field":"REGISTRATION_NO","label":"Registration Number","type":"string","spanWidth":"1","isSelected":true,"display":true,"spanWidthPx":"100"}
      UtilitiesService.IS_USER_PROFILE_TRIGGERED = true;
    }
  }
  getLoggedInUserDetails() {
    //Service Implementation
    let response = {"tuple":{"old":{"getLoggedInUserDetails":{"getLoggedInUserDetails":{"USER_DETAILS":{"USER_DN":"cn=priya,cn=organizational users,o=AGC,cn=cordys,cn=defaultInst,o=uvpvcnxb1x5erpigljqg102j2g.ix.internal.cloudapp.net","USER_NAME":"priya"}}}}}}
    let resp = response.tuple.old.getLoggedInUserDetails.getLoggedInUserDetails.USER_DETAILS;
    if (resp) {
      UtilitiesService.CURRENT_USER_NAME = resp.USER_NAME;
      UtilitiesService.CURRENT_USER_DN = resp.USER_DN;
      this.loadUserProfile();
      this.utilService.cUserName.next({ UserName: UtilitiesService.CURRENT_USER_NAME, UserDN: UtilitiesService.CURRENT_USER_DN });
    }
  }
  getMenuConfig() {
    this.allServiceList = [];
    //Service Implementation
    let response = {"Services":{"MenuService":[{"Services":{"Title":{"Value":"CONSOLIDATED_REPORT"},"ServiceName":"Migration Consolidated Report","ServiceURL":null,"ServiceType":"Application Menu","ServiceDescription":"Migration Consolidated Report","ServiceTooltip":"Migration Consolidated Report","HasChildren":"false","IsMainService":"false","ServiceCode":"CONSOLIDATED_REPORT","ServiceIconPath":null,"Services-id":{"Id":"114694","ItemId":"002248573547A1ECA231DC72645DE817.114694"}}},{"Services":{"Title":{"Value":"DATA_UPLOAD"},"ServiceName":"Data Upload","ServiceURL":null,"ServiceType":"Application Menu","ServiceDescription":"Data Upload","ServiceTooltip":"Data Upload","HasChildren":"false","IsMainService":"false","ServiceCode":"DATA_UPLOAD","ServiceIconPath":null,"Services-id":{"Id":"114695","ItemId":"002248573547A1ECA231DC72645DE817.114695"}}},{"Services":{"Title":{"Value":"INGESTION_REPORT"},"ServiceName":"Data Ingestion Report","ServiceURL":null,"ServiceType":"Application Menu","ServiceDescription":"Data Ingestion Report","ServiceTooltip":"Data Ingestion Report","HasChildren":"false","IsMainService":"false","ServiceCode":"INGESTION_REPORT","ServiceIconPath":null,"Services-id":{"Id":"114696","ItemId":"002248573547A1ECA231DC72645DE817.114696"}}},{"Services":{"Title":{"Value":"VALIDATION_REPORT"},"ServiceName":"Data Validation Report","ServiceURL":null,"ServiceType":"Application Menu","ServiceDescription":"Data Validation Report","ServiceTooltip":"Data Validation Report","HasChildren":"false","IsMainService":"false","ServiceCode":"VALIDATION_REPORT","ServiceIconPath":null,"Services-id":{"Id":"114697","ItemId":"002248573547A1ECA231DC72645DE817.114697"}}},{"Services":{"Title":{"Value":"MIGRATION_REPORT"},"ServiceName":"Data Migration Report","ServiceURL":null,"ServiceType":"Application Menu","ServiceDescription":"Data Migration Report","ServiceTooltip":"Data Migration Report","HasChildren":"false","IsMainService":"false","ServiceCode":"MIGRATION_REPORT","ServiceIconPath":null,"Services-id":{"Id":"114698","ItemId":"002248573547A1ECA231DC72645DE817.114698"}}}]}}
    let resp = response.Services
    if (resp.MenuService.length > 0) {
        resp.MenuService.forEach((serv: any) => {
          this.allServiceList.push({
            ServiceId: serv.Services.ServiceCode,
            ServiceName: serv.Services.ServiceName,
            ExternalUrl: serv.Services.ServiceURL,
            Tooltip: serv.Services.ServiceTooltip,
            ServiceTitle: serv.Services.Title.Value,
            ServiceCode: serv.Services.ServiceCode,
            ServiceDescription: serv.Services.ServiceDescription,
            ChildServices: serv.ChildServices ? serv.ChildServices.Services : null
          })
        })
      }
    if (this.allServiceList.length > 0) {
      this.filterServices();
      this.servicesPresent = true;
    } else {
      this.servicesPresent = false;
    }
  }
  filterServices() {
    this.accordionServiceList = [];
    this.buttonServiceList = [];
    _.forEach(this.allServiceList, serv => {
      if (serv.ChildServices && serv.ChildServices.length > 0) {
        this.accordionServiceList.push(serv);
      } else if (serv.ChildServices && !serv.ChildServices.length) {
        let service: any = { ChildServices: [] }
        service.ExternalUrl = serv.ExternalUrl
        service.ServiceCode = serv.ServiceCode
        service.ServiceDescription = serv.ServiceDescription
        service.ServiceId = serv.ServiceId
        service.ServiceName = serv.ServiceName
        service.ServiceTitle = serv.ServiceTitle
        service.Tooltip = serv.Tooltip
        serv.ChildServices.StyleClass = 'custom-req-btn shadow';
        service.ChildServices.push(serv.ChildServices)
        this.accordionServiceList.push(service);
      }
    })
    _.forEach(this.allServiceList, serv => {
      if (!serv.ChildServices || (serv.ChildServices && serv.ChildServices.length == 0)) {
        if (serv.ServiceCode == 'CONSOLIDATED_REPORT'){
          serv.StyleClass = 'custom-serv-btn-selected';
        } else{
          serv.StyleClass = 'custom-serv-btn';
        }
        this.buttonServiceList.push(serv);
      }
    })
  }
  loadService(serviceObj: any) {
    this.buttonServiceList.forEach((bsl: any) => {
      bsl.StyleClass = 'custom-serv-btn';
    })
    this.serviceTitle = serviceObj.ServiceDescription
    this.serviceURL = serviceObj.ExternalUrl
    this.servIdentifier = serviceObj.ServiceCode
    this.clearMenu = true;
    serviceObj.StyleClass = 'custom-serv-btn-selected';
    if (!this.utilService.isEmpty(this.serviceURL)) {
      this.utilService.pushRoute(this.serviceURL);
    }
  }
  hideModal() {
    this.modalRef.hide()
  }
  createServiceRequest() {
    this.isReqSubmitted = true;
  }
  onRequestSubmit(data: any) {
    if (data.status == 'SUCCESS') {
      this.hideModal();
      this.isReqSubmitted = false;
    } else {
      setTimeout(() => {
        this.isReqSubmitted = false;
      });
    }
  }
  hideRequestModal() {
    this.isReqSubmitted = false;
    this.hideModal();
  }
  onMenuClick(menuData: any) {
    this.clearMenu = false;
    this.breadcrumbMenu.forEach((menu: any) => {
      menu.styleClass = 'custom-menu'
    })
    menuData.item.styleClass = 'custom-active-menu'
    let index = _.findIndex(this.breadcrumbMenu, function (menu: any) { return menu.label == menuData.item.label; })
    if(index != -1){
      this.breadcrumbMenu = this.utilService.clearBreadcrumbAfterIndex(this.breadcrumbMenu,index);
    }
  }
  pushToBreadcrumb(label: string, icon: string, routerLink: string, queryParams: any, commandType: string, commandDesc: string, styleClass: string) {
    let index: any;
    if (commandType == 'DASHBOARD_RELOAD' || commandType == 'PUSH_TO_MENU') {
      index = _.findIndex(this.breadcrumbMenu, function (menu: any) { return menu.label == label; })
      if (index == -1) {
        this.breadcrumbMenu.push({
          label: label, icon: icon, styleClass: styleClass, command: (event: any) => {
            this.utilService.reloadDashboard(commandDesc);
          }
        })
        if (commandType == 'DASHBOARD_RELOAD') {
          this.servIdentifier = commandDesc;
        }
      }
    }
  }
}
