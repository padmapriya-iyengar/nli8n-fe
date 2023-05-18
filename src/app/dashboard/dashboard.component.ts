import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import * as _ from "lodash";
import { UtilityService } from '../commons/utilities.service';
import { DASHBOARD_TASKS } from '../entities/dashboard-tasks';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { NOTIFICATION_DETAILS } from '../entities/notification-details';
import { Table } from 'primeng/table';
import { DatePipe } from '@angular/common';
import { ConfirmationService } from 'primeng/api';
import { AppService } from '../commons/app.service';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{
  constructor(private utilService: UtilityService, private modalService: BsModalService, 
    private datePipe: DatePipe, private confirmationService: ConfirmationService,
    private appService: AppService) { }
  dashboardCountObj: any = {};
  selectedTask: any;
  dashboardTaskCols: any[] = [];
  filteredTasks: any[] = [];
  notifications: any[] = [];
  modalRef!: BsModalRef;
  serviceTitle!: string;
  entityURL!: string;
  allNotifications: NOTIFICATION_DETAILS[] = [];
  reqIdentifier!: string;
  isReqSubmitted!: boolean;
  allServiceList: any[] = [];
  accordionServiceList: any[] = [];
  buttonServiceList: any[] = [];
  activeTabIndex: number = 0;
  searchText: string = '';
  @ViewChild('tasksDT') userTasks!: Table;
  otherColumns: any[] = [];
  otherColumnsData: any[] = [];
  allColumns: any[] =[];
  isTaskSelected: boolean = false;
  isBossSelected: boolean = false;
  bossName: string = "";
  bossDN: string = "";
  showSpinner: boolean = false;
  servicesPresent: boolean = true;
  totalTableHeaderWidth: number = 255;

  ngOnInit(): void {
    this.getLoggedInUserDetails();
    this.loadAllColumns();
    this.loadOtherColumns();
    this.getTaskData('PersonalTasks');
    this.getMenuConfig();
    this.utilService.bossInfo.subscribe(boss => {
      this.isBossSelected = true;
      this.bossName = boss.BOSS_NAME;
      this.bossDN = boss.BOSS_DN
      this.getDelegatedTasks('PersonalTasks');
    })
  }
  loadAllColumns() {
    this.allColumns = [
      { field: "DELIVERY_DATE", label: "Received Date", type: "datetime", spanWidth: "2", isSelected: false, display: true, spanWidthPx: "200" },
      { field: "FILE_REF_NO", label: "Ref No.", type: "string", spanWidth: "1", isSelected: false, display: true, spanWidthPx: "200" },
      { field: "REQUEST_ID", label: "Req ID", type: "string", spanWidth: "1", isSelected: false, display: true, spanWidthPx: "100" },
      { field: "CIRCULATION_ID", label: "Circulation ID", type: "string", spanWidth: "2", isSelected: false, display: true, spanWidthPx: "200" },
      { field: "TASK_TITLE", label: "Title", type: "string", spanWidth: "2", isSelected: false, display: true, spanWidthPx: "200" },
      { field: "FILE_TITLE", label: "File Title", type: "string", spanWidth: "1", isSelected: false, display: true, spanWidthPx: "200" },
      { field: "TASK_ACTION", label: "Action", type: "string", spanWidth: "1", isSelected: false, display: true, spanWidthPx: "100" },
      { field: "REQUEST_DUE_DATE", label: "Due Date", type: "date", spanWidth: "2", isSelected: false, display: true, spanWidthPx: "200" },
      { field: "TASK_STATUS", label: "Status", type: "string", spanWidth: "1", isSelected: false, display: true, spanWidthPx: "100" },
      { field: "TASK_FROM", label: "From", type: "string", spanWidth: "1", isSelected: false, display: true, spanWidthPx: "100" },
      { field: "ASSIGNEE", label: "Locked By", type: "string", spanWidth: "1", isSelected: false, display: true, spanWidthPx: "100" },
      { field: "LOCKED_TIME", label: "Locked Time", type: "string", spanWidth: "1", isSelected: false, display: true, spanWidthPx: "100" },
      { field: "EXPECTED_RESPONSE_DATE", label: "Expected Response Date", type: "date", spanWidth: "2", isSelected: false, display: true, spanWidthPx: "200" },
      { field: "ACTION_OFFICER", label: "Action Officer", type: "string", spanWidth: "1", isSelected: false, display: true, spanWidthPx: "100" },
      { field: "REGISTRATION_NO", label: "Registration Number", type: "string", spanWidth: "1", isSelected: false, display: true, spanWidthPx: "100" },
      { field: "RETENTION_PERIOD", label: "Retention Period", type: "string", spanWidth: "1", isSelected: false, display: false, spanWidthPx: "100" },
      { field: "DISPOSITION_DATE", label: "Disposition Date", type: "date", spanWidth: "1", isSelected: false, display: false, spanWidthPx: "100" },
      { field: "DISPOSITION_ACTION", label: "Disposition Action", type: "string", spanWidth: "1", isSelected: false, display: false, spanWidthPx: "100" },
      { field: "LAST_ACTION_DATE", label: "Last Action Date", type: "date", spanWidth: "1", isSelected: false, display: false, spanWidthPx: "100" },
      { field: "FILE_TYPE", label: "File Type", type: "string", spanWidth: "1", isSelected: false, display: false, spanWidthPx: "100" },
      { field: "CONVERSION_DATE", label: "Conversion Date", type: "date", spanWidth: "1", isSelected: false, display: false, spanWidthPx: "100" },
      { field: "TRANSFER_DATE", label: "Transfer Date", type: "date", spanWidth: "1", isSelected: false, display: false, spanWidthPx: "100" },
      { field: "URGENCY", label: "Urgency", type: "string", spanWidth: "1", isSelected: false, display: false, spanWidthPx: "100" },
      { field: "LOCKED", label: "Locked", type: "string", spanWidth: "1", isSelected: false, display: false, spanWidthPx: "100" },
    ]
  }
  loadOtherColumns() {
    this.otherColumns = [
      { field: "DELIVERY_DATE", label: "Received Date", type: "datetime", spanWidth: "2", spanWidthPx: "200" },
      { field: "FILE_TITLE", label: "File Title", type: "string", spanWidth: "2", spanWidthPx: "200" },
      { field: "TASK_STATUS", label: "Status", type: "string", spanWidth: "1", spanWidthPx: "100" },
      { field: "TASK_FROM", label: "From", type: "string", spanWidth: "1", spanWidthPx: "100" },
      { field: "LOCKED_TIME", label: "Locked Time", type: "string", spanWidth: "1", spanWidthPx: "100" },
      { field: "EXPECTED_RESPONSE_DATE", label: "Expected Response Date", type: "date", spanWidth: "2", spanWidthPx: "200" },
      { field: "ACTION_OFFICER", label: "Action Officer", type: "string", spanWidth: "1", spanWidthPx: "100" },
      { field: "REGISTRATION_NO", label: "Registration Number", type: "string", spanWidth: "1", spanWidthPx: "100" },
      { field: "RETENTION_PERIOD", label: "Retention Period", type: "string", spanWidth: "1", spanWidthPx: "100" },
      { field: "DISPOSITION_DATE", label: "Disposition Date", type: "date", spanWidth: "1", spanWidthPx: "100" },
      { field: "DISPOSITION_ACTION", label: "Disposition Action", type: "string", spanWidth: "1", spanWidthPx: "100" },
      { field: "LAST_ACTION_DATE", label: "Last Action Date", type: "date", spanWidth: "1", spanWidthPx: "100" },
      { field: "FILE_TYPE", label: "File Type", type: "string", spanWidth: "1", spanWidthPx: "100" },
      { field: "CONVERSION_DATE", label: "Conversion Date", type: "date", spanWidth: "1", spanWidthPx: "100" },
      { field: "TRANSFER_DATE", label: "Transfer Date", type: "date", spanWidth: "1", spanWidthPx: "100" }
    ]
  }
  loadTaskColumns(){
    if(!UtilityService.IS_USER_PROFILE_TRIGGERED){
      //Service Integration
      let response = {
        "UserProfile":{"ContactNumber":{"@nil":"true"},"DisplayName":"Priya","OutOfOfficeMessage":{"@nil":"true"},"Name":"priya","DateFrom":{"@nil":"true"},"DepartmentName":"IAD","ReceiveEmailNotifications":"false","OutOfOffice":"false","LastUpdatedBy":"priya","LastUpdatedOn":"2022-11-02T08:48:58Z","UserID":"priya","DateUntil":{"@nil":"true"},"Email":{"@nil":"true"},"UserProfile-id":{"Id":"213000","ItemId":"002248573547A1ECA6E5D79B37C2E81A.213000"}},"FunctionalGroup":[{"FunctionalGroup-id":{"Id":"49155","ItemId":"002248573547A1ECA0C26352C534A817.49155"},"GroupName":"IAD","GroupCreatedInOTDS":"Yes","IsDivision":"true","IsChild":"No","GroupDescription":"International Affairs Division","GroupType":"Functional","UserLinkedToGroup":{"@nil":"true"},"Status":"A","Title":{"Value":"IAD"}},{"FunctionalGroup-id":{"Id":"180226","ItemId":"002248573547A1ECA0C26352C534A817.180226"},"GroupName":"Migration Data Admin","GroupCreatedInOTDS":"No","IsDivision":"false","IsChild":"Yes","GroupDescription":"Migration Data Admin","GroupType":"Functional","UserLinkedToGroup":"No","Status":"A","Title":{"Value":"Migration Data Admin"}},{"FunctionalGroup-id":{"Id":"163843","ItemId":"002248573547A1ECA0C26352C534A817.163843"},"GroupName":"SECURITY ADMIN","GroupCreatedInOTDS":"No","IsDivision":"false","IsChild":"Yes","GroupDescription":"Security Administrator","GroupType":"Functional","UserLinkedToGroup":"No","Status":"A","Title":{"Value":"SECURITY ADMIN"}},{"FunctionalGroup-id":{"Id":"1","ItemId":"002248573547A1ECA0C26352C534A817.1"},"GroupName":"AGC","GroupCreatedInOTDS":"Yes","IsDivision":"false","IsChild":"No","GroupDescription":"Attorney General Chambers","GroupType":"Functional","UserLinkedToGroup":{"@nil":"true"},"Status":"A","Title":{"Value":"AGC"}},{"FunctionalGroup-id":{"Id":"49156","ItemId":"002248573547A1ECA0C26352C534A817.49156"},"GroupName":"REGISTRY (IAD)","GroupCreatedInOTDS":"Yes","IsDivision":"false","IsChild":"Yes","GroupDescription":"Registry team of IAD","GroupType":"Functional","UserLinkedToGroup":{"@nil":"true"},"Status":"A","Title":{"Value":"REGISTRY (IAD)"}}]
      }
      let resp = response.UserProfile;
      UtilityService.CURRENT_USER_ITEM_ID = resp['UserProfile-id']['ItemId'];
      UtilityService.IS_USER_PROFILE_TRIGGERED = true;
      UtilityService.CURRENT_USER_INBOX_PREF=[{"field":"TASK_ACTION","label":"Action","type":"string","spanWidth":"1","isSelected":true,"display":true,"spanWidthPx":"100"},{"field":"TASK_TITLE","label":"Title","type":"string","spanWidth":"2","isSelected":true,"display":true,"spanWidthPx":"200"},{"field":"FILE_TITLE","label":"File Title","type":"string","spanWidth":"1","isSelected":true,"display":true,"spanWidthPx":"200"},{"field":"FILE_REF_NO","label":"Ref No.","type":"string","spanWidth":"1","isSelected":true,"display":true,"spanWidthPx":"200"},{"field":"REQUEST_ID","label":"Req ID","type":"string","spanWidth":"1","isSelected":true,"display":true,"spanWidthPx":"100"},{"field":"DELIVERY_DATE","label":"Received Date","type":"datetime","spanWidth":"2","isSelected":true,"display":true,"spanWidthPx":"200"},{"field":"CIRCULATION_ID","label":"Circulation ID","type":"string","spanWidth":"2","isSelected":true,"display":true,"spanWidthPx":"200"},{"field":"REQUEST_DUE_DATE","label":"Due Date","type":"date","spanWidth":"2","isSelected":true,"display":true,"spanWidthPx":"200"},{"field":"EXPECTED_RESPONSE_DATE","label":"Expected Response Date","type":"date","spanWidth":"2","isSelected":true,"display":true,"spanWidthPx":"200"},{"field":"TASK_STATUS","label":"Status","type":"string","spanWidth":"1","isSelected":true,"display":true,"spanWidthPx":"100"},{"field":"TASK_FROM","label":"From","type":"string","spanWidth":"1","isSelected":true,"display":true,"spanWidthPx":"100"}]
      this.dashboardTaskCols = UtilityService.CURRENT_USER_INBOX_PREF;
      this.totalTableHeaderWidth = 255;
      this.dashboardTaskCols.forEach((col: any) => {
        this.totalTableHeaderWidth += Number(col.spanWidthPx)
      })
      this.refreshColumnChooser();
    } else{
      this.dashboardTaskCols = UtilityService.CURRENT_USER_INBOX_PREF;
      this.totalTableHeaderWidth = 255;
      this.dashboardTaskCols.forEach((col: any) => {
        this.totalTableHeaderWidth += Number(col.spanWidthPx)
      })
      this.refreshColumnChooser();
    }
  }
  refreshColumnChooser(){
    this.allColumns.forEach((ac: any) => {
      let index = _.findIndex(this.dashboardTaskCols, function (col) { return col.field == ac.field; })
      if (index != -1) {
        ac.isSelected = true;
        this.otherColumnsData.push(ac);
      }
    })
  }
  getLoggedInUserDetails(){
    //Service Integration
    let response = {
      "tuple":{"old":{"getLoggedInUserDetails":{"getLoggedInUserDetails":{"USER_DETAILS":{"USER_DN":"","USER_NAME":"priya"}}}}}
    }
    let resp = response.tuple.old.getLoggedInUserDetails.getLoggedInUserDetails.USER_DETAILS;
    if(resp){
      UtilityService.CURRENT_USER_NAME = resp.USER_NAME;
      UtilityService.CURRENT_USER_DN = resp.USER_DN;
      this.getAllNotifications();
      this.loadTaskColumns();
      this.utilService.cUserName.next({UserName: UtilityService.CURRENT_USER_NAME, UserDN: UtilityService.CURRENT_USER_DN});
    }
  }
  getTaskData(type: any){
    this.getTaskDataCount();
    this.showSpinner = true;
    this.filteredTasks = [];
    //Service Integration
    let response = {
      "tuple":{"old":{"getSharedTasks":{"getSharedTasks":{"TaskDetailsResponse":{"TaskDetails":[{"URGENCY":"Not Urgent","URGENCYMARK":"","TASK_ID":"00224857-3547-A1ED-9906-1926F12D6828","OPEN_DEFAULT_LAYOUT_ID":"N","TASK_TITLE":"IAD Adv File Testing 14-11-2022","FILE_TITLE":"IAD Adv File Testing 14-11-2022","FILE_REF_NO":"AG/IAD/AIR/1/2022/000000042","REQUEST_ID":"ADV000000129","CIRCULATION_ID":"","DELIVERY_DATE":"2022-11-14T12:32:26.0","REQUEST_DUE_DATE":"Thu Dec 01 00:00:00 UTC 2022","EXPECTED_RESPONSE_DATE":"2022-11-14T08:30:34Z","TASK_STATUS":"In-Progress","TASK_FROM":"test","ACTION_OFFICER":"","ASSIGNEE":"","LOCKED_TIME":"","REGISTRATION_NO":"","MAIN_FILE_ITEM_ID":"002248573547A1EC9E9CF72B1B84A817.3145730","RETENTION_PERIOD":"null","DISPOSITION_DATE":"null","DISPOSITION_ACTION":"null","LAST_ACTION_DATE":"null","FILE_TYPE":"null","CONVERSION_DATE":"null","TRANSFER_DATE":"null","SLA_BREACH":"Y","REQUEST_TYPE":"Advisory","ITEM_ID":"002248573547A1EC9F382DC3A9CD6817.3194888","LAYOUT_ID":"002248573547A1ECA2C9120D4202A819","TASK_ENTITY_INSTANCE_ID":"002248573547A1ECA2C843FF7C67A819.3194888.2949134","REQUEST_STATE":"Return to Registry","TARGET_TYPE":"role","PROCESS_NAME":"Request"},{"URGENCY":"Not Urgent","URGENCYMARK":"","TASK_ID":"00224857-3547-A1ED-96A3-C3DD524B6827","OPEN_DEFAULT_LAYOUT_ID":"N","TASK_TITLE":"Demo Test 2-11-2022","FILE_TITLE":"Demo Test 2-11-2022","FILE_REF_NO":"AG/IAD/AIR/FIRS/2022/000000008","REQUEST_ID":"ADV000000091","CIRCULATION_ID":"","DELIVERY_DATE":"2022-11-02T09:16:48.400000000","REQUEST_DUE_DATE":"Fri Nov 18 00:00:00 UTC 2022","EXPECTED_RESPONSE_DATE":"2022-11-25T12:00:00Z","TASK_STATUS":"In-Progress","TASK_FROM":"","ACTION_OFFICER":"iadlo1","ASSIGNEE":"DemoUser1","LOCKED_TIME":"","REGISTRATION_NO":"","MAIN_FILE_ITEM_ID":"002248573547A1EC9E9CF72B1B84A817.3129350","RETENTION_PERIOD":"null","DISPOSITION_DATE":"null","DISPOSITION_ACTION":"null","LAST_ACTION_DATE":"null","FILE_TYPE":"null","CONVERSION_DATE":"null","TRANSFER_DATE":"null","SLA_BREACH":"Y","REQUEST_TYPE":"Advisory","ITEM_ID":"002248573547A1EC9F382DC3A9CD6817.3145729","LAYOUT_ID":"002248573547A1ECA2C1993A6EFCA819","TASK_ENTITY_INSTANCE_ID":"002248573547A1ECA2C843FF7C67A819.3145729.2899969","REQUEST_STATE":"Draft","TARGET_TYPE":"user","PROCESS_NAME":"Request"},{"URGENCY":"Not Urgent","URGENCYMARK":"","TASK_ID":"00224857-3547-A1ED-88AA-E9948093A825","OPEN_DEFAULT_LAYOUT_ID":"Y","TASK_TITLE":"Test for MLA request - Demo - 001","FILE_TITLE":"Test for MLA request - Demo - 001","FILE_REF_NO":"AG/IAD/MLA-T/HK/2022/000000001","REQUEST_ID":"MLA000000001","CIRCULATION_ID":"","DELIVERY_DATE":"2022-08-23T06:20:17.350000000","REQUEST_DUE_DATE":"Mon Aug 15 00:00:00 UTC 2022","EXPECTED_RESPONSE_DATE":"2022-05-30T12:33:48Z","TASK_STATUS":"In-Progress","TASK_FROM":"test","ACTION_OFFICER":"","ASSIGNEE":"harsha","LOCKED_TIME":"","REGISTRATION_NO":"","MAIN_FILE_ITEM_ID":"002248573547A1EC9E9CF72B1B84A817.2342919","RETENTION_PERIOD":"null","DISPOSITION_DATE":"null","DISPOSITION_ACTION":"null","LAST_ACTION_DATE":"null","FILE_TYPE":"null","CONVERSION_DATE":"null","TRANSFER_DATE":"null","SLA_BREACH":"Y","REQUEST_TYPE":"MLA","ITEM_ID":"002248573547A1EC9F382DC3A9CD6817.2703363","LAYOUT_ID":"002248573547A1ECA970AD0E1F05A81B","TASK_ENTITY_INSTANCE_ID":"002248573547A1ECA2C843FF7C67A819.2703363.2834437","REQUEST_STATE":"Return to Registry","TARGET_TYPE":"role","PROCESS_NAME":"Request"},{"URGENCY":"Not Urgent","URGENCYMARK":"","TASK_ID":"00224857-3547-A1ED-88AA-D7A9A0FCA825","OPEN_DEFAULT_LAYOUT_ID":"N","TASK_TITLE":"Request for File Security 1","FILE_TITLE":"Request for File Security 1","FILE_REF_NO":"AG/IAD/AIR/1/2022/000000003","REQUEST_ID":"ADV000000004","CIRCULATION_ID":"","DELIVERY_DATE":"2022-08-23T06:18:23.550000000","REQUEST_DUE_DATE":"Tue Aug 16 00:00:00 UTC 2022","EXPECTED_RESPONSE_DATE":"2022-05-31T12:00:00Z","TASK_STATUS":"In-Progress","TASK_FROM":"test","ACTION_OFFICER":"iadlo2","ASSIGNEE":"harsha","LOCKED_TIME":"","REGISTRATION_NO":"","MAIN_FILE_ITEM_ID":"002248573547A1EC9E9CF72B1B84A817.2359297","RETENTION_PERIOD":"null","DISPOSITION_DATE":"null","DISPOSITION_ACTION":"null","LAST_ACTION_DATE":"null","FILE_TYPE":"null","CONVERSION_DATE":"null","TRANSFER_DATE":"null","SLA_BREACH":"Y","REQUEST_TYPE":"Advisory","ITEM_ID":"002248573547A1EC9F382DC3A9CD6817.2719746","LAYOUT_ID":"002248573547A1ECA2C9120D4202A819","TASK_ENTITY_INSTANCE_ID":"002248573547A1ECA2C843FF7C67A819.2719746.2834436","REQUEST_STATE":"Return to Registry","TARGET_TYPE":"role","PROCESS_NAME":"Request"},{"URGENCY":"Not Urgent","URGENCYMARK":"","TASK_ID":"00224857-3547-A1ED-88A9-BEF3C75E6825","OPEN_DEFAULT_LAYOUT_ID":"N","TASK_TITLE":"TEst for request documents security","FILE_TITLE":"TEst for request documents security","FILE_REF_NO":"AG/IAD/AIR/1/2022/000000026","REQUEST_ID":"ADV000000070","CIRCULATION_ID":"","DELIVERY_DATE":"2022-08-23T05:46:55.950000000","REQUEST_DUE_DATE":"Wed Aug 24 00:00:00 UTC 2022","EXPECTED_RESPONSE_DATE":"2022-07-27T02:13:38Z","TASK_STATUS":"In-Progress","TASK_FROM":"test","ACTION_OFFICER":"iadlo2","ASSIGNEE":"harsha","LOCKED_TIME":"","REGISTRATION_NO":"","MAIN_FILE_ITEM_ID":"002248573547A1EC9E9CF72B1B84A817.3014658","RETENTION_PERIOD":"null","DISPOSITION_DATE":"null","DISPOSITION_ACTION":"null","LAST_ACTION_DATE":"null","FILE_TYPE":"null","CONVERSION_DATE":"null","TRANSFER_DATE":"null","SLA_BREACH":"Y","REQUEST_TYPE":"Advisory","ITEM_ID":"002248573547A1EC9F382DC3A9CD6817.3063810","LAYOUT_ID":"002248573547A1ECA2C9120D4202A819","TASK_ENTITY_INSTANCE_ID":"002248573547A1ECA2C843FF7C67A819.3063810.2834435","REQUEST_STATE":"Return to Registry","TARGET_TYPE":"role","PROCESS_NAME":"Request"},{"URGENCY":"Not Urgent","URGENCYMARK":"","TASK_ID":"00224857-3547-A1ED-8779-D976DA3EE825","OPEN_DEFAULT_LAYOUT_ID":"N","TASK_TITLE":"Demo Request 3","FILE_TITLE":"Demo Request 3","FILE_REF_NO":"AG/IAD/AIR-C/1/2022/000000005","REQUEST_ID":"ADV000000083","CIRCULATION_ID":"","DELIVERY_DATE":"2022-08-17T04:45:27.627000000","REQUEST_DUE_DATE":"Tue Aug 09 00:00:00 UTC 2022","EXPECTED_RESPONSE_DATE":"2022-08-04T01:59:56Z","TASK_STATUS":"In-Progress","TASK_FROM":"test request","ACTION_OFFICER":"","ASSIGNEE":"harsha","LOCKED_TIME":"","REGISTRATION_NO":"","MAIN_FILE_ITEM_ID":"002248573547A1EC9E9CF72B1B84A817.3031062","RETENTION_PERIOD":"null","DISPOSITION_DATE":"null","DISPOSITION_ACTION":"null","LAST_ACTION_DATE":"null","FILE_TYPE":"null","CONVERSION_DATE":"null","TRANSFER_DATE":"null","SLA_BREACH":"Y","REQUEST_TYPE":"Advisory","ITEM_ID":"002248573547A1EC9F382DC3A9CD6817.3080201","LAYOUT_ID":"002248573547A1ECA2C9120D4202A819","TASK_ENTITY_INSTANCE_ID":"002248573547A1ECA2C843FF7C67A819.3080201.2834434","REQUEST_STATE":"Return to Registry","TARGET_TYPE":"role","PROCESS_NAME":"Request"},{"URGENCY":"Not Urgent","URGENCYMARK":"","TASK_ID":"00224857-3547-A1ED-8658-2F1C5FC7E825","OPEN_DEFAULT_LAYOUT_ID":"N","TASK_TITLE":"TEst for request history","FILE_TITLE":"TEst for request history","FILE_REF_NO":"AG/IAD/AIR-C/FIRS/2022/000000001","REQUEST_ID":"ADV000000066","CIRCULATION_ID":"","DELIVERY_DATE":"2022-08-11T10:31:28.027000000","REQUEST_DUE_DATE":"Fri Aug 19 00:00:00 UTC 2022","EXPECTED_RESPONSE_DATE":"2022-07-27T12:00:00Z","TASK_STATUS":"In-Progress","TASK_FROM":"test","ACTION_OFFICER":"","ASSIGNEE":"harsha","LOCKED_TIME":"","REGISTRATION_NO":"","MAIN_FILE_ITEM_ID":"002248573547A1EC9E9CF72B1B84A817.2342928","RETENTION_PERIOD":"null","DISPOSITION_DATE":"null","DISPOSITION_ACTION":"null","LAST_ACTION_DATE":"null","FILE_TYPE":"null","CONVERSION_DATE":"null","TRANSFER_DATE":"null","SLA_BREACH":"Y","REQUEST_TYPE":"Advisory","ITEM_ID":"002248573547A1EC9F382DC3A9CD6817.3047425","LAYOUT_ID":"002248573547A1ECA2C9120D4202A819","TASK_ENTITY_INSTANCE_ID":"002248573547A1ECA2C843FF7C67A819.3047425.2834433","REQUEST_STATE":"Return to Registry","TARGET_TYPE":"role","PROCESS_NAME":"Request"},{"URGENCY":"Not Urgent","URGENCYMARK":"","TASK_ID":"00224857-3547-A1ED-8062-404C2ACAA823","OPEN_DEFAULT_LAYOUT_ID":"N","TASK_TITLE":"Test 551","FILE_TITLE":"","FILE_REF_NO":"AG/IAD/AIR/1/2022/000000038","REQUEST_ID":"","CIRCULATION_ID":"CIR000000031","DELIVERY_DATE":"2022-07-12T02:19:16.473000000","REQUEST_DUE_DATE":"","EXPECTED_RESPONSE_DATE":"","TASK_STATUS":"Draft","TASK_FROM":"DemoUser2","ACTION_OFFICER":"DemoUser3","ASSIGNEE":"DemoUser1","LOCKED_TIME":"","REGISTRATION_NO":"","MAIN_FILE_ITEM_ID":"002248573547A1EC9E9CF72B1B84A817.3129345","RETENTION_PERIOD":"null","DISPOSITION_DATE":"null","DISPOSITION_ACTION":"null","LAST_ACTION_DATE":"null","FILE_TYPE":"null","CONVERSION_DATE":"null","TRANSFER_DATE":"null","SLA_BREACH":"N","REQUEST_TYPE":"Circulation","ITEM_ID":"002248573547A1ECA0C96326EA372817.1146881","LAYOUT_ID":"002248573547A1ECA0C992EF3E40E817","TASK_ENTITY_INSTANCE_ID":"002248573547A1ECA6914EC3CF45E81A.1146881.1114113","REQUEST_STATE":"Draft","TARGET_TYPE":"user","PROCESS_NAME":"Circulation"},{"URGENCY":"Urgent","URGENCYMARK":"!","TASK_ID":"00224857-3547-A1EC-BF14-D71789A7A823","OPEN_DEFAULT_LAYOUT_ID":"N","TASK_TITLE":"Test for sla breach","FILE_TITLE":"Test for sla breach","FILE_REF_NO":"AG/IAD/AIR/2/2022/000000001","REQUEST_ID":"ADV000000038","CIRCULATION_ID":"","DELIVERY_DATE":"2022-07-05T11:12:34.910000000","REQUEST_DUE_DATE":"Wed Jun 29 00:00:00 UTC 2022","EXPECTED_RESPONSE_DATE":"2022-06-21T12:00:00Z","TASK_STATUS":"In-Progress","TASK_FROM":"test","ACTION_OFFICER":"","ASSIGNEE":"DemoUser2","LOCKED_TIME":"","REGISTRATION_NO":"","MAIN_FILE_ITEM_ID":"002248573547A1EC9E9CF72B1B84A817.2342933","RETENTION_PERIOD":"null","DISPOSITION_DATE":"null","DISPOSITION_ACTION":"null","LAST_ACTION_DATE":"null","FILE_TYPE":"null","CONVERSION_DATE":"null","TRANSFER_DATE":"null","SLA_BREACH":"Y","REQUEST_TYPE":"Advisory","ITEM_ID":"002248573547A1EC9F382DC3A9CD6817.2899975","LAYOUT_ID":"002248573547A1ECA2C9120D4202A819","TASK_ENTITY_INSTANCE_ID":"002248573547A1ECA2C843FF7C67A819.2899975.2670631","REQUEST_STATE":"Return to Registry","TARGET_TYPE":"role","PROCESS_NAME":"Request"},{"URGENCY":"Not Urgent","URGENCYMARK":"","TASK_ID":"00224857-3547-A1EC-BF0D-D3F57B1DA823","OPEN_DEFAULT_LAYOUT_ID":"Y","TASK_TITLE":"Request for Actions","FILE_TITLE":"Request for Actions","FILE_REF_NO":"AG/IAD/MLA-T/HK/2022/000000010","REQUEST_ID":"MLA000000006","CIRCULATION_ID":"","DELIVERY_DATE":"2022-07-05T07:51:46.300000000","REQUEST_DUE_DATE":"Tue Aug 02 00:00:00 UTC 2022","EXPECTED_RESPONSE_DATE":"2022-07-05T01:18:21Z","TASK_STATUS":"In-Progress","TASK_FROM":"test","ACTION_OFFICER":"","ASSIGNEE":"jyoDemoUser2thi","LOCKED_TIME":"","REGISTRATION_NO":"","MAIN_FILE_ITEM_ID":"002248573547A1EC9E9CF72B1B84A817.2801668","RETENTION_PERIOD":"null","DISPOSITION_DATE":"null","DISPOSITION_ACTION":"null","LAST_ACTION_DATE":"null","FILE_TYPE":"null","CONVERSION_DATE":"null","TRANSFER_DATE":"null","SLA_BREACH":"Y","REQUEST_TYPE":"MLA","ITEM_ID":"002248573547A1EC9F382DC3A9CD6817.2949143","LAYOUT_ID":"002248573547A1ECA970AD0E1F05A81B","TASK_ENTITY_INSTANCE_ID":"002248573547A1ECA2C843FF7C67A819.2949143.2670629","REQUEST_STATE":"Return to Registry","TARGET_TYPE":"role","PROCESS_NAME":"Request"},{"URGENCY":"Not Urgent","URGENCYMARK":"","TASK_ID":"00224857-3547-A1EC-BE47-43A5FCCE2823","OPEN_DEFAULT_LAYOUT_ID":"Y","TASK_TITLE":"Request for actions check 2","FILE_TITLE":"Request for actions check 2","FILE_REF_NO":"AG/IAD/AIR/2/2021/000000001","REQUEST_ID":"ADV000000040","CIRCULATION_ID":"","DELIVERY_DATE":"2022-07-01T09:06:18.150000000","REQUEST_DUE_DATE":"Thu Jul 07 00:00:00 UTC 2022","EXPECTED_RESPONSE_DATE":"2022-06-29T12:05:03Z","TASK_STATUS":"In-Progress","TASK_FROM":"test","ACTION_OFFICER":"DemoUser1","ASSIGNEE":"harsha","LOCKED_TIME":"","REGISTRATION_NO":"","MAIN_FILE_ITEM_ID":"002248573547A1EC9E9CF72B1B84A817.2359341","RETENTION_PERIOD":"null","DISPOSITION_DATE":"null","DISPOSITION_ACTION":"null","LAST_ACTION_DATE":"null","FILE_TYPE":"null","CONVERSION_DATE":"null","TRANSFER_DATE":"null","SLA_BREACH":"Y","REQUEST_TYPE":"Advisory","ITEM_ID":"002248573547A1EC9F382DC3A9CD6817.2932738","LAYOUT_ID":"002248573547A1ECA970AD0E1EFC681B","TASK_ENTITY_INSTANCE_ID":"002248573547A1ECA2C843FF7C67A819.2932738.2670623","REQUEST_STATE":"Return to Registry","TARGET_TYPE":"role","PROCESS_NAME":"Request"},{"URGENCY":"Not Urgent","URGENCYMARK":"","TASK_ID":"00224857-3547-A1EC-BE45-93C06D09A823","OPEN_DEFAULT_LAYOUT_ID":"N","TASK_TITLE":"Test for actions","FILE_TITLE":"Test for actions","FILE_REF_NO":"AG/IAD/AIR/1/2021/000000004","REQUEST_ID":"ADV000000049","CIRCULATION_ID":"","DELIVERY_DATE":"2022-07-01T08:17:56.767000000","REQUEST_DUE_DATE":"Fri Jul 29 00:00:00 UTC 2022","EXPECTED_RESPONSE_DATE":"2022-07-01T01:46:03Z","TASK_STATUS":"In-Progress","TASK_FROM":"test","ACTION_OFFICER":"iadlo1","ASSIGNEE":"harsha","LOCKED_TIME":"","REGISTRATION_NO":"","MAIN_FILE_ITEM_ID":"002248573547A1EC9E9CF72B1B84A817.2392117","RETENTION_PERIOD":"null","DISPOSITION_DATE":"null","DISPOSITION_ACTION":"null","LAST_ACTION_DATE":"null","FILE_TYPE":"null","CONVERSION_DATE":"null","TRANSFER_DATE":"null","SLA_BREACH":"Y","REQUEST_TYPE":"Advisory","ITEM_ID":"002248573547A1EC9F382DC3A9CD6817.2949130","LAYOUT_ID":"002248573547A1ECA2C9120D4202A819","TASK_ENTITY_INSTANCE_ID":"002248573547A1ECA2C843FF7C67A819.2949130.2670616","REQUEST_STATE":"Return to Registry","TARGET_TYPE":"role","PROCESS_NAME":"Request"},{"URGENCY":"Not Urgent","URGENCYMARK":"","TASK_ID":"00224857-3547-A1EC-BE16-7B2AD19AA823","OPEN_DEFAULT_LAYOUT_ID":"N","TASK_TITLE":"MLA request for different actions","FILE_TITLE":"MLA request for different actions","FILE_REF_NO":"AG/IAD/EXTR-F/FIN/2021/000000001","REQUEST_ID":"MLA000000005","CIRCULATION_ID":"","DELIVERY_DATE":"2022-06-30T09:49:34.410000000","REQUEST_DUE_DATE":"Thu Jul 28 00:00:00 UTC 2022","EXPECTED_RESPONSE_DATE":"2022-06-30T03:04:25Z","TASK_STATUS":"Assigned","TASK_FROM":"test","ACTION_OFFICER":"DemoUser3","ASSIGNEE":"DemoUser1","LOCKED_TIME":"","REGISTRATION_NO":"","MAIN_FILE_ITEM_ID":"002248573547A1EC9E9CF72B1B84A817.2752516","RETENTION_PERIOD":"null","DISPOSITION_DATE":"null","DISPOSITION_ACTION":"null","LAST_ACTION_DATE":"null","FILE_TYPE":"null","CONVERSION_DATE":"null","TRANSFER_DATE":"null","SLA_BREACH":"Y","REQUEST_TYPE":"Extradition","ITEM_ID":"002248573547A1EC9F382DC3A9CD6817.2949121","LAYOUT_ID":"002248573547A1ECA392D4444FB4281A","TASK_ENTITY_INSTANCE_ID":"002248573547A1ECA2C843FF7C67A819.2949121.2670603","REQUEST_STATE":"Assign within Division","TARGET_TYPE":"role","PROCESS_NAME":"Request"},{"URGENCY":"Not Urgent","URGENCYMARK":"","TASK_ID":"00224857-3547-A1EC-BDE4-BB909C886823","OPEN_DEFAULT_LAYOUT_ID":"N","TASK_TITLE":"Request to check actions 3","FILE_TITLE":"Request to check actions 3","FILE_REF_NO":"AG/IAD/AIR/1/2022/000000004","REQUEST_ID":"ADV000000041","CIRCULATION_ID":"","DELIVERY_DATE":"2022-06-29T10:05:06.457000000","REQUEST_DUE_DATE":"Thu Jul 07 00:00:00 UTC 2022","EXPECTED_RESPONSE_DATE":"2022-06-29T01:48:08Z","TASK_STATUS":"Open","TASK_FROM":"test","ACTION_OFFICER":"iadlo1","ASSIGNEE":"DemoUser1","LOCKED_TIME":"","REGISTRATION_NO":"","MAIN_FILE_ITEM_ID":"002248573547A1EC9E9CF72B1B84A817.2392114","RETENTION_PERIOD":"null","DISPOSITION_DATE":"null","DISPOSITION_ACTION":"null","LAST_ACTION_DATE":"null","FILE_TYPE":"null","CONVERSION_DATE":"null","TRANSFER_DATE":"null","SLA_BREACH":"Y","REQUEST_TYPE":"Advisory","ITEM_ID":"002248573547A1EC9F382DC3A9CD6817.2932739","LAYOUT_ID":"002248573547A1ECA2C9120D41FB2819","TASK_ENTITY_INSTANCE_ID":"002248573547A1ECA2C843FF7C67A819.2932739.2654214","REQUEST_STATE":"Assign within Division","TARGET_TYPE":"role","PROCESS_NAME":"Request"},{"URGENCY":"Not Urgent","URGENCYMARK":"","TASK_ID":"00224857-3547-A1EC-BDDD-54EE89DC2823","OPEN_DEFAULT_LAYOUT_ID":"N","TASK_TITLE":"Request for Actions check","FILE_TITLE":"Request for Actions check","FILE_REF_NO":"AG/IAD/AIR/2/2022/000000001","REQUEST_ID":"ADV000000039","CIRCULATION_ID":"","DELIVERY_DATE":"2022-06-29T06:33:11.223000000","REQUEST_DUE_DATE":"Thu Jul 07 00:00:00 UTC 2022","EXPECTED_RESPONSE_DATE":"2022-06-29T11:56:05Z","TASK_STATUS":"Open","TASK_FROM":"test","ACTION_OFFICER":"DemoUser2","ASSIGNEE":"DemoUser1","LOCKED_TIME":"","REGISTRATION_NO":"","MAIN_FILE_ITEM_ID":"002248573547A1EC9E9CF72B1B84A817.2342933","RETENTION_PERIOD":"null","DISPOSITION_DATE":"null","DISPOSITION_ACTION":"null","LAST_ACTION_DATE":"null","FILE_TYPE":"null","CONVERSION_DATE":"null","TRANSFER_DATE":"null","SLA_BREACH":"Y","REQUEST_TYPE":"Advisory","ITEM_ID":"002248573547A1EC9F382DC3A9CD6817.2932737","LAYOUT_ID":"002248573547A1ECA2C9120D41FB2819","TASK_ENTITY_INSTANCE_ID":"002248573547A1ECA2C843FF7C67A819.2932737.2654210","REQUEST_STATE":"Assign within Division","TARGET_TYPE":"role","PROCESS_NAME":"Request"},{"URGENCY":"Not Urgent","URGENCYMARK":"","TASK_ID":"00224857-3547-A1EC-BC86-2B23455B2822","OPEN_DEFAULT_LAYOUT_ID":"Y","TASK_TITLE":"New Test Request harsha","FILE_TITLE":"New Test Request harsha","FILE_REF_NO":"AG/IAD/AIR-C/FIRS/2021/000000001","REQUEST_ID":"ADV000000036","CIRCULATION_ID":"","DELIVERY_DATE":"2022-06-22T10:47:23.677000000","REQUEST_DUE_DATE":"Wed Jun 29 00:00:00 UTC 2022","EXPECTED_RESPONSE_DATE":"2022-06-22T12:00:00Z","TASK_STATUS":"Open","TASK_FROM":"test","ACTION_OFFICER":"","ASSIGNEE":"DemoUser1","LOCKED_TIME":"","REGISTRATION_NO":"","MAIN_FILE_ITEM_ID":"002248573547A1EC9E9CF72B1B84A817.2752514","RETENTION_PERIOD":"null","DISPOSITION_DATE":"null","DISPOSITION_ACTION":"null","LAST_ACTION_DATE":"null","FILE_TYPE":"null","CONVERSION_DATE":"null","TRANSFER_DATE":"null","SLA_BREACH":"Y","REQUEST_TYPE":"Advisory","ITEM_ID":"002248573547A1EC9F382DC3A9CD6817.2899973","LAYOUT_ID":"002248573547A1ECA970AD0E1EFC681B","TASK_ENTITY_INSTANCE_ID":"002248573547A1ECA2C843FF7C67A819.2899973.2621441","REQUEST_STATE":"Return to Registry","TARGET_TYPE":"role","PROCESS_NAME":"Request"},{"URGENCY":"Not Urgent","URGENCYMARK":"","TASK_ID":"00224857-3547-A1EC-B8C8-C74AD297681F","OPEN_DEFAULT_LAYOUT_ID":"N","TASK_TITLE":"Test for Group Values in Request Participants","FILE_TITLE":"Test for Group Values in Request Participants","FILE_REF_NO":"AG/IAD/AIR/1/2021/000000002","REQUEST_ID":"ADV000000006","CIRCULATION_ID":"","DELIVERY_DATE":"2022-06-03T09:54:15.530000000","REQUEST_DUE_DATE":"Fri Aug 19 00:00:00 UTC 2022","EXPECTED_RESPONSE_DATE":"2022-06-03T12:00:00Z","TASK_STATUS":"Open","TASK_FROM":"test","ACTION_OFFICER":"","ASSIGNEE":"DemoUser1","LOCKED_TIME":"","REGISTRATION_NO":"","MAIN_FILE_ITEM_ID":"002248573547A1EC9E9CF72B1B84A817.2359298","RETENTION_PERIOD":"null","DISPOSITION_DATE":"null","DISPOSITION_ACTION":"null","LAST_ACTION_DATE":"null","FILE_TYPE":"null","CONVERSION_DATE":"null","TRANSFER_DATE":"null","SLA_BREACH":"Y","REQUEST_TYPE":"Advisory","ITEM_ID":"002248573547A1EC9F382DC3A9CD6817.2719748","LAYOUT_ID":"002248573547A1ECA2C9120D4202A819","TASK_ENTITY_INSTANCE_ID":"002248573547A1ECA2C843FF7C67A819.2719748.2441224","REQUEST_STATE":"Return to Registry","TARGET_TYPE":"role","PROCESS_NAME":"Request"}]}}}}}
    }
    let resp = response.tuple.old.getSharedTasks.getSharedTasks.TaskDetailsResponse;
    if (resp){
      if (resp.TaskDetails.length > 0){
        resp.TaskDetails.forEach((task:any) => {
          task.LOCKED = !this.utilService.isEmpty(task.ASSIGNEE) ? 'Y' : 'N'
          if (task.TARGET_TYPE == 'user') {
            task.icon = 'fa fa-pencil'
          } else if (task.ASSIGNEE == UtilityService.CURRENT_USER_NAME) {
            task.icon = 'fa fa-user'
          } else {
            task.icon = 'fa fa-group'
          }
          this.filteredTasks.push(task);
        })
      }
    }
    this.showSpinner = false;
  }
  getDelegatedTasks(type: any){
    this.getDelegatedTaskDataCount();
    this.showSpinner = true;
    this.filteredTasks = [];
    //Service Integration
    let response = {
      "tuple":{"old":{"getDelegatedTasksForUser":{"getDelegatedTasksForUser":{"TaskDetailsResponse":{"TaskDetails":[{"URGENCY":"Not Urgent","URGENCYMARK":"","TASK_ID":"00224857-3547-A1ED-822D-8B0354C7A824","OPEN_DEFAULT_LAYOUT_ID":"N","TASK_TITLE":"Cir PA Test 5","FILE_TITLE":"","FILE_REF_NO":"AG/IAD/AIR/1/2022/000000002","REQUEST_ID":"","CIRCULATION_ID":"CIR000000038","DELIVERY_DATE":"2022-07-21T05:30:10.653000000","REQUEST_DUE_DATE":"","EXPECTED_RESPONSE_DATE":"","TASK_STATUS":"Inprogress","TASK_FROM":"iadlo1","ACTION_OFFICER":"iadlo3","ASSIGNEE":"iadlo3","LOCKED_TIME":"","REGISTRATION_NO":"","MAIN_FILE_ITEM_ID":"002248573547A1EC9E9CF72B1B84A817.2342914","RETENTION_PERIOD":"null","DISPOSITION_DATE":"null","DISPOSITION_ACTION":"null","LAST_ACTION_DATE":"null","FILE_TYPE":"null","CONVERSION_DATE":"null","TRANSFER_DATE":"null","SLA_BREACH":"N","REQUEST_TYPE":"Circulation","ITEM_ID":"002248573547A1ECA0C96326EA372817.1196037","LAYOUT_ID":"002248573547A1ECA970F4BBD4D0A81B","TASK_ENTITY_INSTANCE_ID":"002248573547A1ECA6914EC3CF45E81A.1196037.1163274","REQUEST_STATE":"Inprogress","TARGET_TYPE":"role","PROCESS_NAME":"Circulation"},{"URGENCY":"Not Urgent","URGENCYMARK":"","TASK_ID":"00224857-3547-A1ED-822D-6D265F582824","OPEN_DEFAULT_LAYOUT_ID":"N","TASK_TITLE":"Cir PA Test 4","FILE_TITLE":"","FILE_REF_NO":"AG/IAD/AIR/1/2022/000000002","REQUEST_ID":"","CIRCULATION_ID":"CIR000000037","DELIVERY_DATE":"2022-07-21T05:26:50.810000000","REQUEST_DUE_DATE":"","EXPECTED_RESPONSE_DATE":"","TASK_STATUS":"Inprogress","TASK_FROM":"iadlo1","ACTION_OFFICER":"iadlo3","ASSIGNEE":"iadlo3","LOCKED_TIME":"","REGISTRATION_NO":"","MAIN_FILE_ITEM_ID":"002248573547A1EC9E9CF72B1B84A817.2342914","RETENTION_PERIOD":"null","DISPOSITION_DATE":"null","DISPOSITION_ACTION":"null","LAST_ACTION_DATE":"null","FILE_TYPE":"null","CONVERSION_DATE":"null","TRANSFER_DATE":"null","SLA_BREACH":"N","REQUEST_TYPE":"Circulation","ITEM_ID":"002248573547A1ECA0C96326EA372817.1196036","LAYOUT_ID":"002248573547A1ECA970F4BBD4D0A81B","TASK_ENTITY_INSTANCE_ID":"002248573547A1ECA6914EC3CF45E81A.1196036.1163272","REQUEST_STATE":"Inprogress","TARGET_TYPE":"role","PROCESS_NAME":"Circulation"},{"URGENCY":"Not Urgent","URGENCYMARK":"","TASK_ID":"00224857-3547-A1ED-822D-5B3BE88FA824","OPEN_DEFAULT_LAYOUT_ID":"N","TASK_TITLE":"Cir PA Test 3","FILE_TITLE":"","FILE_REF_NO":"AG/IAD/AIR/1/2022/000000002","REQUEST_ID":"","CIRCULATION_ID":"CIR000000036","DELIVERY_DATE":"2022-07-21T05:24:47.437000000","REQUEST_DUE_DATE":"","EXPECTED_RESPONSE_DATE":"","TASK_STATUS":"Inprogress","TASK_FROM":"iadlo1","ACTION_OFFICER":"iadlo3","ASSIGNEE":"iadlo3","LOCKED_TIME":"","REGISTRATION_NO":"","MAIN_FILE_ITEM_ID":"002248573547A1EC9E9CF72B1B84A817.2342914","RETENTION_PERIOD":"null","DISPOSITION_DATE":"null","DISPOSITION_ACTION":"null","LAST_ACTION_DATE":"null","FILE_TYPE":"null","CONVERSION_DATE":"null","TRANSFER_DATE":"null","SLA_BREACH":"N","REQUEST_TYPE":"Circulation","ITEM_ID":"002248573547A1ECA0C96326EA372817.1196035","LAYOUT_ID":"002248573547A1ECA970F4BBD4D0A81B","TASK_ENTITY_INSTANCE_ID":"002248573547A1ECA6914EC3CF45E81A.1196035.1163270","REQUEST_STATE":"Inprogress","TARGET_TYPE":"role","PROCESS_NAME":"Circulation"},{"URGENCY":"Not Urgent","URGENCYMARK":"","TASK_ID":"00224857-3547-A1ED-822D-2B7300306824","OPEN_DEFAULT_LAYOUT_ID":"N","TASK_TITLE":"Cir PA Test 2","FILE_TITLE":"","FILE_REF_NO":"AG/IAD/AIR/1/2022/000000002","REQUEST_ID":"","CIRCULATION_ID":"CIR000000035","DELIVERY_DATE":"2022-07-21T05:19:28.697000000","REQUEST_DUE_DATE":"","EXPECTED_RESPONSE_DATE":"","TASK_STATUS":"Inprogress","TASK_FROM":"iadlo1","ACTION_OFFICER":"iadlo3","ASSIGNEE":"iadlo3","LOCKED_TIME":"","REGISTRATION_NO":"","MAIN_FILE_ITEM_ID":"002248573547A1EC9E9CF72B1B84A817.2342914","RETENTION_PERIOD":"null","DISPOSITION_DATE":"null","DISPOSITION_ACTION":"null","LAST_ACTION_DATE":"null","FILE_TYPE":"null","CONVERSION_DATE":"null","TRANSFER_DATE":"null","SLA_BREACH":"N","REQUEST_TYPE":"Circulation","ITEM_ID":"002248573547A1ECA0C96326EA372817.1196034","LAYOUT_ID":"002248573547A1ECA970F4BBD4D0A81B","TASK_ENTITY_INSTANCE_ID":"002248573547A1ECA6914EC3CF45E81A.1196034.1163268","REQUEST_STATE":"Inprogress","TARGET_TYPE":"role","PROCESS_NAME":"Circulation"},{"URGENCY":"Not Urgent","URGENCYMARK":"","TASK_ID":"00224857-3547-A1ED-822C-AC84C974A824","OPEN_DEFAULT_LAYOUT_ID":"N","TASK_TITLE":"Cir PA Test 1","FILE_TITLE":"","FILE_REF_NO":"AG/IAD/AIR/1/2022/000000002","REQUEST_ID":"","CIRCULATION_ID":"CIR000000034","DELIVERY_DATE":"2022-07-21T05:05:20.197000000","REQUEST_DUE_DATE":"","EXPECTED_RESPONSE_DATE":"","TASK_STATUS":"Inprogress","TASK_FROM":"iadlo1","ACTION_OFFICER":"iadlo3","ASSIGNEE":"iadlo3","LOCKED_TIME":"","REGISTRATION_NO":"","MAIN_FILE_ITEM_ID":"002248573547A1EC9E9CF72B1B84A817.2342914","RETENTION_PERIOD":"null","DISPOSITION_DATE":"null","DISPOSITION_ACTION":"null","LAST_ACTION_DATE":"null","FILE_TYPE":"null","CONVERSION_DATE":"null","TRANSFER_DATE":"null","SLA_BREACH":"N","REQUEST_TYPE":"Circulation","ITEM_ID":"002248573547A1ECA0C96326EA372817.1196033","LAYOUT_ID":"002248573547A1ECA970F4BBD4D0A81B","TASK_ENTITY_INSTANCE_ID":"002248573547A1ECA6914EC3CF45E81A.1196033.1163266","REQUEST_STATE":"Inprogress","TARGET_TYPE":"role","PROCESS_NAME":"Circulation"}]}}}}}
    }
    let resp = response.tuple.old.getDelegatedTasksForUser.getDelegatedTasksForUser.TaskDetailsResponse;
    if (resp) {
      if (resp.TaskDetails.length > 0) {
        resp.TaskDetails.forEach((task: any) => {
          if (task.REQUEST_STATE != 'Draft') {
            task.icon = 'fa fa-user'
            task.LOCKED = !this.utilService.isEmpty(task.ASSIGNEE) ? 'Y' : 'N'
            this.filteredTasks.push(task);
          } else {
            task.icon = 'fa fa-pencil'
          }
        })
      }
    }
    this.showSpinner = false;
  }
  
  getMenuConfig(){
    this.allServiceList = [];
    //Service Integration
    let response = {"Services":{"MenuService":[{"Services":{"Title":{"Value":"ADVISORY"},"ServiceName":"Advisory","ServiceURL":null,"ServiceType":"Application Menu","ServiceDescription":"Advisory Main menu","ServiceTooltip":"Advisory","HasChildren":"true","IsMainService":"false","ServiceCode":"ADVISORY","ServiceIconPath":null,"Services-id":{"Id":"16386","ItemId":"002248573547A1ECA231DC72645DE817.16386"}},"ChildServices":{"Services":[{"Title":{"Value":"ADV_FILE"},"ServiceName":"Create File","ServiceURL":null,"ServiceType":"Application Menu","ServiceDescription":"Create New Advisory File","ServiceTooltip":null,"HasChildren":"false","IsMainService":"false","ServiceCode":"ADV_FILE","ServiceIconPath":"/images/a.png","Services-id":{"Id":"16387","ItemId":"002248573547A1ECA231DC72645DE817.16387"}},{"Title":{"Value":"ADV_REQ"},"ServiceName":"Create Request","ServiceURL":null,"ServiceType":"Application Menu","ServiceDescription":"Create New Advisory Request","ServiceTooltip":null,"HasChildren":null,"IsMainService":"false","ServiceCode":"ADV_REQ","ServiceIconPath":null,"Services-id":{"Id":"16389","ItemId":"002248573547A1ECA231DC72645DE817.16389"}}]}},{"Services":{"Title":{"Value":"MLA"},"ServiceName":"MLA / Extradition","ServiceURL":null,"ServiceType":"Application Menu","ServiceDescription":"MLA Main menu","ServiceTooltip":null,"HasChildren":"true","IsMainService":"false","ServiceCode":"MLA","ServiceIconPath":null,"Services-id":{"Id":"16388","ItemId":"002248573547A1ECA231DC72645DE817.16388"}},"ChildServices":{"Services":[{"Title":{"Value":"MLA_FILE"},"ServiceName":"Create File","ServiceURL":null,"ServiceType":"Application Menu","ServiceDescription":"Create MLA/Extradition File","ServiceTooltip":null,"HasChildren":"false","IsMainService":"false","ServiceCode":"MLA_FILE","ServiceIconPath":null,"Services-id":{"Id":"65538","ItemId":"002248573547A1ECA231DC72645DE817.65538"}},{"Title":{"Value":"MLA_REQ"},"ServiceName":"Create Request","ServiceURL":null,"ServiceType":"Application Menu","ServiceDescription":"Create New MLA/Extradition Request","ServiceTooltip":null,"HasChildren":"false","IsMainService":"false","ServiceCode":"MLA_REQ","ServiceIconPath":null,"Services-id":{"Id":"65540","ItemId":"002248573547A1ECA231DC72645DE817.65540"}}]}},{"Services":{"Title":{"Value":"REOPEN_REQ"},"ServiceName":"Re-Open Closed Request","ServiceURL":null,"ServiceType":"Application Menu","ServiceDescription":"Re-Open Closed Request","ServiceTooltip":null,"HasChildren":null,"IsMainService":"false","ServiceCode":"REOPEN_REQ","ServiceIconPath":null,"Services-id":{"Id":"16391","ItemId":"002248573547A1ECA231DC72645DE817.16391"}}},{"Services":{"Title":{"Value":"RECALL_REASSIGN"},"ServiceName":"Recall / Reassign Request","ServiceURL":null,"ServiceType":"Application Menu","ServiceDescription":"Recall / Reassign Request","ServiceTooltip":null,"HasChildren":null,"IsMainService":"false","ServiceCode":"RECALL_REASSIGN","ServiceIconPath":null,"Services-id":{"Id":"16392","ItemId":"002248573547A1ECA231DC72645DE817.16392"}}},{"Services":{"Title":{"Value":"DOCUMENT"},"ServiceName":"Upload Document","ServiceURL":"docUpload","ServiceType":"Application Menu","ServiceDescription":"Upload Document","ServiceTooltip":"Upload Document","HasChildren":"false","IsMainService":"false","ServiceCode":null,"ServiceIconPath":null,"Services-id":{"Id":"131071","ItemId":"002248573547A1ECA231DC72645DE817.131071"}}},{"Services":{"Title":{"Value":"MIGRATION_PORTAL"},"ServiceName":"Migration","ServiceURL":"migration","ServiceType":"Application Menu","ServiceDescription":"Migration","ServiceTooltip":"Migration","HasChildren":"false","IsMainService":"false","ServiceCode":null,"ServiceIconPath":null,"Services-id":{"Id":"131076","ItemId":"002248573547A1ECA231DC72645DE817.131076"}}}]}}

    let resp = response.Services
    if (null != resp) {
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
    }
    if (this.allServiceList.length > 0) {
      this.filterServices();
      this.servicesPresent = true;
    } else {
      this.servicesPresent = false;
    }
  }
  filterServices(){
    this.accordionServiceList = [];
    this.buttonServiceList = [];
    _.forEach(this.allServiceList, serv => {
      if (serv.ChildServices && serv.ChildServices.length > 0){
        this.accordionServiceList.push(serv);
      } else if (serv.ChildServices && !serv.ChildServices.length) {
        let service: any = { ChildServices: []}
        service.ExternalUrl = serv.ExternalUrl
        service.ServiceCode = serv.ServiceCode
        service.ServiceDescription = serv.ServiceDescription
        service.ServiceId = serv.ServiceId
        service.ServiceName = serv.ServiceName
        service.ServiceTitle = serv.ServiceTitle
        service.Tooltip = serv.Tooltip
        service.ChildServices.push(serv.ChildServices)
        this.accordionServiceList.push(service);
      }
    })
    _.forEach(this.allServiceList, serv => {
      if (!serv.ChildServices || (serv.ChildServices && serv.ChildServices.length == 0)) {
        this.buttonServiceList.push(serv);
      }
    })
  }
  filterTask(status: string){
    this.filteredTasks = [];
    this.activeTabIndex = 0;
    if (status == 'ALL'){
      this.getTaskData('AllTasks')
    }
    else if (status == 'ALL_OVERDUE') {
      this.getTaskData('AllOverdueTasks')
    }
    else if (status == 'MY_TASKS') {
      this.getTaskData('PersonalTasks')
    }
    else if (status == 'MY_TASKS_OVERDUE') {
      this.getTaskData('PersonalOverdueTasks')
    }
    else if (status == 'SHARED_TASKS'){
      this.getTaskData('SharedTasks')
    }
    else if (status == 'SHARED_TASKS_OVERDUE') {
      this.getTaskData('SharedOverdueTasks')
    }
    else if (status == 'DRAFT_TASKS'){
      this.getTaskData('DraftTasks')
    }
  }
  getAllNotifications(){
    this.allNotifications = [];
    this.appService.getUserNotifications('priya').subscribe((response) => {
      let resp = Object.assign(response)
      if(resp){
        if(resp.length){
          resp.forEach((item:any) => {
            if (item.status == 'A'){
              this.allNotifications.push({
                ItemId: item.id,
                FileReferenceNo: item.file_reference_no,
                RequestNo: item.request_no,
                Actor: item.actor,
                MessageCode: item.message_code,
                MessageType: item.message_type,
                Responder: item.responder,
                Message: item.message,
                Status: item.status,
                CreatedDate: this.datePipe.transform(item.created_date.split('T')[0], 'MMM d, y'),
                ModifiedDate: item.modified_date,
                MessageReadStatus: item.message_read_status,
                UserGroup: item.user_group,
                CreatedTime: item.created_date.split('T')[1].substring(0, 5),
                ShowRead: item.message_read_status == 'NotRead' ? true : false,
                ShowDelete: item.status == 'A' ? true : false,
                ShowNotf: item.status == 'A' ? true : false,
                NotfHeader: _.capitalize(item.actor ? item.actor.substring(0, 1) : item.responder.substring(0, 1)),
                StyleClass: item.message_read_status == 'Read' ? 'notf-row' : 'read-notf-row',
                RequestState: item.request_state,
                SourceItemId: item.source_item_id,
                LayoutID: '',
                TaskEntityInstanceID: ''
              })
            }
          })
        } else{
          if (resp.status == 'A'){
            this.allNotifications.push({
              ItemId: resp.id,
              FileReferenceNo: resp.file_reference_no,
              RequestNo: resp.request_no,
              Actor: resp.actor,
              MessageCode: resp.message_code,
              MessageType: resp.message_type,
              Responder: resp.responder,
              Message: resp.message,
              Status: resp.status,
              CreatedDate: this.datePipe.transform(resp.created_date.split('T')[0], 'MMM d, y'),
              ModifiedDate: resp.modified_date,
              MessageReadStatus: resp.message_read_status,
              UserGroup: resp.user_group,
              CreatedTime: resp.created_date.split('T')[1].substring(0, 5),
              ShowRead: resp.message_read_status == 'NotRead' ? true : false,
              ShowDelete: resp.status == 'A' ? true : false,
              ShowNotf: resp.status == 'A' ? true : false,
              NotfHeader: _.capitalize(resp.actor ? resp.actor.substring(0, 1) : resp.responder.substring(0, 1)),
              StyleClass: resp.message_read_status == 'Read' ? 'notf-row' : 'read-notf-row',
              RequestState: resp.request_state,
              SourceItemId: resp.source_item_id,
              LayoutID: '',
              TaskEntityInstanceID: ''
            })
          }
        }
        this.dashboardCountObj.notfCount = this.allNotifications.length;
      }
    },
    (error) => {
      console.error('Request failed with error')
      this.showSpinner = false;
    })
  }
  openServiceModal(template: TemplateRef<any>, serviceObj: any, cssClass: string) {
    this.serviceTitle = serviceObj.ServiceDescription
    this.entityURL = serviceObj.ExternalUrl
    this.reqIdentifier = serviceObj.ServiceCode
    if(this.utilService.isEmpty(this.entityURL)){
      this.modalRef = this.modalService.show(template, {
        class: cssClass, keyboard: false,
        backdrop: true,
        ignoreBackdropClick: true
      });
    } else{
      this.utilService.pushRoute(this.entityURL);
    }
  }
  openNotfModal(template: TemplateRef<any>, cssClass: string) {
    this.modalRef = this.modalService.show(template, {
      class: cssClass, keyboard: false,
      backdrop: true,
      ignoreBackdropClick: true
    });
  }
  hideModal(){
    this.modalRef.hide()
  }
  hideNotfModal(){
    this.getAllNotifications();
    this.modalRef.hide();
  }
  goToSearch() {
    this.utilService.saveToStorage('SearchText',this.searchText);
    this.utilService.saveToStorage('SearchType', 'basic');
    this.utilService.pushRoute("search");
  }
  goToAdvSearch() {
    this.utilService.saveToStorage('SearchType', 'advanced');
    this.utilService.pushRoute("search");
  }
  createServiceRequest(){
      this.isReqSubmitted = true;
  }
  onRequestSubmit(data: any){
    if (data.status == 'SUCCESS'){
      this.hideModal();
      this.isReqSubmitted = false;
    } else {
      setTimeout(() => {
        this.isReqSubmitted = false;
      });
    }
  }
  hideRequestModal(){
    this.isReqSubmitted = false;
    this.hideModal();
  }
  onTaskSelect(data: any){
    
  }
  onOtherColumnSelect(selectData: any, rowData: any) {
    if (selectData.checked) {
      let cIndex = _.findIndex(this.otherColumnsData, function (col) { return col.field == rowData.field; })
      if (cIndex == -1) {
        this.otherColumnsData.push(rowData)
      }
    } else {
      let cIndex = _.findIndex(this.otherColumnsData, function (col) { return col.field == rowData.field; })
      if (cIndex != -1) {
        this.otherColumnsData.splice(cIndex, 1);
      }
    }
  }
  addNewColumns(){
    this.dashboardTaskCols = [];
    this.otherColumnsData.forEach(oCol => {
      let cIndex = _.findIndex(this.dashboardTaskCols, function (col) { return col.field == oCol.field; })
      if (cIndex == -1) {
        this.dashboardTaskCols.push(oCol)
      }
    })
  }
  openOtherColumnModal(template: TemplateRef<any>, cssClass: string){
    this.openNotfModal(template,cssClass);
  }
  onRecallReassignSubmit(data: any){
    if (data.ACTION == 'RECALL'){
      if (data.STATUS == 'SUCCESS'){
        this.utilService.alert('success', 'Success', 'Request ' + data.REQUEST_ID + ' recalled successfully!!', false);
        this.hideRequestModal();
        this.getTaskData('PersonalTasks');
      }
    } else if (data.ACTION == 'REASSIGN') {
      if (data.STATUS == 'SUCCESS') {
        this.utilService.alert('success', 'Success', 'Request ' + data.REQUEST_ID + ' reassigned successfully!!', false);
        this.hideRequestModal();
        this.getTaskData('PersonalTasks');
      }
    }
  }
  onReopenSubmit(data: any) {
    if (data.STATUS == 'SUCCESS') {
      this.utilService.alert('success', 'Success', 'Request ' + data.REQUEST_ID + ' reopened successfully!!', false);
      this.hideRequestModal();
      this.getTaskData('PersonalTasks');
    }
  }
  onCirculationSubmit(data: any) {
    if (data.ACTION == 'RECALL') {
      if (data.STATUS == 'SUCCESS') {
        this.utilService.alert('success', 'Success', 'Circulation ' + data.CirculationID + ' recalled successfully!!', true);
        this.hideRequestModal();
        this.getTaskData('PersonalTasks');
      }
    }
    else if (data.ACTION == 'TERMINATE') {
      if (data.STATUS == 'SUCCESS') {
        this.utilService.alert('success', 'Success', 'Circulation ' + data.CirculationID + ' terminated successfully!!', true);
        this.hideRequestModal();
        this.getTaskData('PersonalTasks');
      }
    }
  }
  refreshTasks(){
    this.filteredTasks = [];
    let context:any = this;
    if(this.isBossSelected){
      setTimeout(function () { context.getDelegatedTasks('PersonalTasks'); }, 1000);
    } else{
      setTimeout(function () { context.getTaskData('PersonalTasks'); }, 1000);
    }
  }
  onTaskSelected(data: any){
    this.isTaskSelected = true;
  }
  onTaskUnselected(data: any){
    this.isTaskSelected = false;
  }
  claimRevoke(action: string, data: any){
    if(action == 'CLAIM'){
      this.confirmationService.confirm({
        message: 'Do you confirm to claim the request ' + data.REQUEST_ID +'?',
        header: 'Claiming ' + data.REQUEST_ID,
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.claimRequest(data);
        }
      });
    }
    if (action == 'REVOKE') {
      this.confirmationService.confirm({
        message: 'Do you confirm to revoke the request ' + data.REQUEST_ID +'?',
        header: 'Revoking ' + data.REQUEST_ID,
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.revokeRequest(data);
        }
      });
    }
  }
  claimRequest(data: any){
    
  }
  revokeRequest(data: any){
    
  }
  removeBoss(){
    this.isBossSelected = false;
    this.bossName = "";
    this.bossDN = ""
    this.getTaskData('PersonalTasks');
  }
  resetDashboardCount(){
    this.dashboardCountObj.sharedCount = '0'
    this.dashboardCountObj.allCount = '0'
    this.dashboardCountObj.pendingCount = '0'
    this.dashboardCountObj.pendingOverdueCount = '0'
    this.dashboardCountObj.allOverdueCount = '0'
    this.dashboardCountObj.sharedOverdueCount = '0'
    this.dashboardCountObj.draftCount = '0'
  }
  getTaskDataCount(){
    this.resetDashboardCount();
    //Service Integration
    let response = {
      "tuple":{"old":{"getSharedTasks":{"getSharedTasks":{"TaskDetailsResponse":{"TaskCounter":{"PersonalTasks":"3","PersonalOverDueTasks":"0","SharedTasks":"12","SharedOverDueTasks":"0","AllTasks":"17","AllOverDueTasks":"0","DraftTasks":"2"}}}}}}
    }
    let resp = response.tuple.old.getSharedTasks.getSharedTasks.TaskDetailsResponse;
    if (resp.TaskCounter){
      this.dashboardCountObj.allCount = resp.TaskCounter.AllTasks;
      this.dashboardCountObj.allOverdueCount = resp.TaskCounter.AllOverDueTasks;
      this.dashboardCountObj.pendingCount = resp.TaskCounter.PersonalTasks;
      this.dashboardCountObj.pendingOverdueCount = resp.TaskCounter.PersonalOverDueTasks
      this.dashboardCountObj.sharedCount = resp.TaskCounter.SharedTasks;
      this.dashboardCountObj.sharedOverdueCount = resp.TaskCounter.SharedOverDueTasks;
      this.dashboardCountObj.draftCount = resp.TaskCounter.DraftTasks;
    }
  }
  getDelegatedTaskDataCount(){
    this.resetDashboardCount();
    //Service Integration
    let response = {
      "tuple":{"old":{"getDelegatedTasksForUser":{"getDelegatedTasksForUser":{"TaskDetailsResponse":{"TaskCounter":{"PersonalTasks":"5","PersonalOverDueTasks":"0","SharedTasks":"0","SharedOverDueTasks":"0","AllTasks":"5","AllOverDueTasks":"0","DraftTasks":"0"}}}}}}
    }
    let resp = response.tuple.old.getDelegatedTasksForUser.getDelegatedTasksForUser.TaskDetailsResponse;
    if (resp.TaskCounter) {
      this.dashboardCountObj.allCount = resp.TaskCounter.AllTasks;
      this.dashboardCountObj.allOverdueCount = resp.TaskCounter.AllOverDueTasks;
      this.dashboardCountObj.pendingCount = resp.TaskCounter.PersonalTasks;
      this.dashboardCountObj.pendingOverdueCount = resp.TaskCounter.PersonalOverDueTasks
      this.dashboardCountObj.sharedCount = resp.TaskCounter.SharedTasks;
      this.dashboardCountObj.sharedOverdueCount = resp.TaskCounter.SharedOverDueTasks;
      this.dashboardCountObj.draftCount = resp.TaskCounter.DraftTasks;
    }
  }
}
