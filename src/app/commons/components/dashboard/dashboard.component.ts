import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import * as _ from "lodash";
import { UtilitiesService } from '../../services/utilities.service';
import { DASHBOARD_TASKS } from '../../../entities/dashboard-tasks';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DatePipe } from '@angular/common';
import { ConfirmationService } from 'primeng/api';
import { WebsocketService } from '../../services/websocket.service';
import { AgcService } from '../../services/agc.service';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{
  constructor(private utilService: UtilitiesService, private modalService: BsModalService, 
    private datePipe: DatePipe, private confirmationService: ConfirmationService,
    private agcService: AgcService, private wsService: WebsocketService) { 
      wsService.messages.subscribe(msg => {
        this.wsReceivedMessages.push(msg);
        let notfData = this.wsReceivedMessages.filter((msg) => msg.identifier == 'NOTIFICATION_INFO');
        this.allNotifications = notfData[notfData.length - 1].data
        this.utilService.getUserNotfs(this.allNotifications)
      });
    }
  fileTaskCols: any[] = [];
  notifications: any[] = [];
  modalRef!: BsModalRef;
  serviceTitle!: string;
  entityURL!: string;
  reqIdentifier!: string;
  isReqSubmitted!: boolean;
  isTaskSelected: boolean = false;
  showSpinner: boolean = false;
  totalTableHeaderWidth: number = 255;
  fileTasks:DASHBOARD_TASKS[] = []
  requestTaskCols: any[] = [];
  requestTasks:DASHBOARD_TASKS[] = []
  wsReceivedMessages: any[] = [];
  allNotifications: any[] = [];
  userNotifications: any[] = [];

  ngOnInit(): void {
    this.getLoggedInUserDetails();
    this.loadAllColumns();
    this.getFileTasksData();
  }
  loadAllColumns() {
    this.fileTaskCols = [
      { field: "DELIVERY_DATE", label: "Received Date", type: "datetime", spanWidthPx: "200" },
      { field: "FILE_REF_NO", label: "Ref No.", type: "string", spanWidthPx: "200" },
      { field: "TASK_TITLE", label: "Title", type: "string", spanWidthPx: "200" },
      { field: "FILE_TITLE", label: "File Title", type: "string", spanWidthPx: "200" },
      { field: "TASK_STATUS", label: "Status", type: "string", spanWidthPx: "100" },
      { field: "TASK_FROM", label: "From", type: "string", spanWidthPx: "100" },
      { field: "ASSIGNEE", label: "Locked By", type: "string", spanWidthPx: "100" },
      { field: "FILE_TYPE", label: "File Type", type: "string", spanWidthPx: "100" }
    ]
    this.requestTaskCols = [
      { field: "DELIVERY_DATE", label: "Received Date", type: "datetime", spanWidthPx: "200" },
      { field: "REQUEST_ID", label: "Request ID", type: "string", spanWidthPx: "200" },
      { field: "FILE_REF_NO", label: "Ref No.", type: "string", spanWidthPx: "200" },
      { field: "TASK_TITLE", label: "Title", type: "string", spanWidthPx: "200" },
      { field: "TASK_STATUS", label: "Status", type: "string", spanWidthPx: "100" },
      { field: "TASK_FROM", label: "From", type: "string", spanWidthPx: "100" },
      { field: "ASSIGNEE", label: "Locked By", type: "string", spanWidthPx: "200" },
      { field: "REQUEST_DUE_DATE", label: "Due Date", type: "datetime", spanWidthPx: "200" },
      { field: "EXPECTED_RESPONSE_DATE", label: "Response Date", type: "datetime", spanWidthPx: "200" },
      { field: "REQUEST_TYPE", label: "Request Type", type: "string", spanWidthPx: "200" }
    ]
  }
  getLoggedInUserDetails(){
    this.utilService.cUserName.next({UserName: UtilitiesService.CURRENT_USER_NAME, UserDN: UtilitiesService.CURRENT_USER_DN});
  }
  getFileTasksData(){
    this.showSpinner = true;
    this.fileTasks = [];
      this.agcService.getFilesForDashboard(UtilitiesService.CURRENT_USER_NAME).subscribe({next: (response) => {
        let resp = Object.assign(response)
        if (resp){
          if (resp.length > 0){
            resp.forEach((task:any) => {
              task.LOCKED = !this.utilService.isEmpty(task.ASSIGNEE) ? 'Y' : 'N'
              if (task.TARGET_TYPE == 'user') {
                task.icon = 'fa fa-pencil'
              } else if (task.ASSIGNEE == UtilitiesService.CURRENT_USER_NAME) {
                task.icon = 'fa fa-user'
              } else {
                task.icon = 'fa fa-group'
              }
              this.fileTasks.push(task);
            })
          }
        }
        this.showSpinner = false;
        this.getRequestTasksData();
      },
      error: (error) => {
        console.log('Request failed with error');
        this.showSpinner = false;
      }
    })
  }
  getRequestTasksData(){
    this.showSpinner = true;
    this.requestTasks = [];
      this.agcService.getRequestsForDashboard(UtilitiesService.CURRENT_USER_NAME).subscribe({next: (response) => {
        let resp = Object.assign(response)
        if (resp){
          if (resp.length > 0){
            resp.forEach((task:any) => {
              task.LOCKED = !this.utilService.isEmpty(task.ASSIGNEE) ? 'Y' : 'N'
              if (task.TARGET_TYPE == 'user') {
                task.icon = 'fa fa-pencil'
              } else if (task.ASSIGNEE == UtilitiesService.CURRENT_USER_NAME) {
                task.icon = 'fa fa-user'
              } else {
                task.icon = 'fa fa-group'
              }
              this.requestTasks.push(task);
            })
          }
        }
        this.showSpinner = false;
      },
      error: (error) => {
        console.log('Request failed with error');
        this.showSpinner = false;
      }
    })
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
  onFileTaskSelect(data: any){
    
  }
  onRequestTaskSelect(data: any){
    
  }
  refreshFileTasks(){
    this.fileTasks = [];
    let context:any = this;
    setTimeout(function () { context.getFileTasksData(); }, 1000);
  }
  refreshRequestTasks(){
    this.requestTasks = [];
    let context:any = this;
    setTimeout(function () { context.getRequestTasksData(); }, 1000);
  }
  onFileTaskSelected(data: any){
    this.isTaskSelected = true;
  }
  onFileTaskUnselected(data: any){
    this.isTaskSelected = false;
  }
  onRequestTaskSelected(data: any){
    this.isTaskSelected = true;
  }
  onRequestTaskUnselected(data: any){
    this.isTaskSelected = false;
  }
}
