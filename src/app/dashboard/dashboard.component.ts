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
  reqIdentifier!: string;
  isReqSubmitted!: boolean;
  activeTabIndex: number = 0;
  searchText: string = '';
  @ViewChild('tasksDT') userTasks!: Table;
  otherColumns: any[] = [];
  otherColumnsData: any[] = [];
  allColumns: any[] =[];
  isTaskSelected: boolean = false;
  showSpinner: boolean = false;
  totalTableHeaderWidth: number = 255;

  ngOnInit(): void {
    this.getLoggedInUserDetails();
    this.loadAllColumns();
    this.loadOtherColumns();
    this.getTaskData('PersonalTasks');
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
    this.dashboardTaskCols = UtilityService.CURRENT_USER_INBOX_PREF;
      this.totalTableHeaderWidth = 255;
      this.dashboardTaskCols.forEach((col: any) => {
        this.totalTableHeaderWidth += Number(col.spanWidthPx)
      })
    this.refreshColumnChooser();
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
    this.loadTaskColumns();
    this.utilService.cUserName.next({UserName: UtilityService.CURRENT_USER_NAME, UserDN: UtilityService.CURRENT_USER_DN});
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
  openService(template: TemplateRef<any>, serviceName:any){
    let serviceObj = {
      ServiceDescription:'',
      ExternalUrl:'',
      ServiceCode:''
    };
    if(serviceName == 'ADV_FILE'){
      serviceObj.ServiceDescription = 'Create New Advisory File';
      serviceObj.ServiceCode = serviceName;
    }
    if(serviceName == 'ADV_REQ'){
      serviceObj.ServiceDescription = 'Create New Advisory Request';
      serviceObj.ServiceCode = serviceName;
    }
    if(serviceName == 'MLA_FILE'){
      serviceObj.ServiceDescription = 'Create MLA/Extradition File';
      serviceObj.ServiceCode = serviceName;
    }
    if(serviceName == 'MLA_REQ'){
      serviceObj.ServiceDescription = 'Create New MLA/Extradition Request';
      serviceObj.ServiceCode = serviceName;
    }
    if(serviceName == 'MIGRATION_PORTAL'){
      serviceObj.ServiceDescription = 'Migration';
      serviceObj.ExternalUrl = 'migration'
      serviceObj.ServiceCode = serviceName;
    }
    this.openServiceModal(template,serviceObj,'xxl-modal')
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
  hideModal(){
    this.modalRef.hide()
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
  refreshTasks(){
    this.filteredTasks = [];
    let context:any = this;
    setTimeout(function () { context.getTaskData('PersonalTasks'); }, 1000);
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
}
