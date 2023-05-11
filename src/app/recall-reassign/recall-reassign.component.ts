import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmationService } from 'primeng/api';
import { UtilityService } from '../commons/utilities.service';

@Component({
  selector: 'recall-reassign',
  templateUrl: './recall-reassign.component.html',
  styleUrls: ['./recall-reassign.component.scss']
})
export class RecallReassignComponent implements OnInit {
  constructor(private confirmationService: ConfirmationService, 
    private utilService: UtilityService, private modalService: BsModalService) { }

  allRequests: any[] = [];
  recallReassignCols: any[] = [];
  requestID: string = "";
  selectedRequest: any = {};
  modalRef!: BsModalRef;
  @ViewChild('reassignModal') reassign!: TemplateRef<any>;
  @Output() reqSubmit = new EventEmitter<any>();
  isReqSubmitted!: boolean;

  ngOnInit(): void {
    this.recallReassignCols = [
      { field: "RequestNo", label: "Request ID", type: "string", spanWidth: "1" },
      { field: "I_MainFileRefNo", label: "File Ref No.", type: "string", spanWidth: "1" },
      { field: "RequestTitle", label: "Request Title", type: "string", spanWidth: "2" },
      { field: "ReceivedDate", label: "Received Date", type: "date", spanWidth: "1" },
      { field: "OfficerName", label: "Assignee", type: "string", spanWidth: "1"},
    ]
    this.getAllRequests();
  }
  getAllRequests(){
    this.allRequests = [];
    //Service Implementation
    let response = {"tuple":{"old":{"getRequestsForRecallOrReassign":{"getRequestsForRecallOrReassign":{"Requests":{"Request":[{"RequestTitle":"IAD Adv File Testing 14-11-2022","I_MainFileRefNo":"AG/IAD/AIR/1/2022/000000042","RequestNo":"ADV000000129","ReceivedDate":"2022-11-14T12:32:26.0","OfficerName":""},{"RequestTitle":"Demo Test 2-11-2022","I_MainFileRefNo":"AG/IAD/AIR/FIRS/2022/000000008","RequestNo":"ADV000000091","ReceivedDate":"2022-11-02T09:16:48.400000000","OfficerName":"iadlo1","ASSIGNEE":"DemoUser1"},{"RequestTitle":"Test for MLA request - Demo - 001","I_MainFileRefNo":"AG/IAD/MLA-T/HK/2022/000000001","RequestNo":"MLA000000001","ReceivedDate":"2022-08-23T06:20:17.350000000","OfficerName":""},{"RequestTitle":"Request for File Security 1","I_MainFileRefNo":"AG/IAD/AIR/1/2022/000000003","RequestNo":"ADV000000004","ReceivedDate":"2022-08-23T06:18:23.550000000","OfficerName":"iadlo2"},{"RequestTitle":"TEst for request documents security","I_MainFileRefNo":"AG/IAD/AIR/1/2022/000000026","RequestNo":"ADV000000070","ReceivedDate":"2022-08-23T05:46:55.950000000","OfficerName":"iadlo2",},{"RequestTitle":"Demo Request 3","I_MainFileRefNo":"AG/IAD/AIR-C/1/2022/000000005","RequestNo":"ADV000000083","ReceivedDate":"2022-08-17T04:45:27.627000000","OfficerName":"",},{"RequestTitle":"TEst for request history","I_MainFileRefNo":"AG/IAD/AIR-C/FIRS/2022/000000001","RequestNo":"ADV000000066","ReceivedDate":"2022-08-11T10:31:28.027000000","OfficerName":""},{"RequestTitle":"","I_MainFileRefNo":"AG/IAD/AIR/1/2022/000000038","RequestNo":"","ReceivedDate":"2022-07-12T02:19:16.473000000","OfficerName":"DemoUser2"},{"RequestTitle":"Test for sla breach","I_MainFileRefNo":"AG/IAD/AIR/2/2022/000000001","RequestNo":"ADV000000038","ReceivedDate":"2022-07-05T11:12:34.910000000","OfficerName":""},{"RequestTitle":"Request for Actions","I_MainFileRefNo":"AG/IAD/MLA-T/HK/2022/000000010","RequestNo":"MLA000000006","ReceivedDate":"2022-07-05T07:51:46.300000000","OfficerName":""},{"RequestTitle":"Request for actions check 2","I_MainFileRefNo":"AG/IAD/AIR/2/2021/000000001","RequestNo":"ADV000000040","ReceivedDate":"2022-07-01T09:06:18.150000000","OfficerName":"Demo User 2"}]}}}}}}
    let resp = response.tuple.old.getRequestsForRecallOrReassign.getRequestsForRecallOrReassign.Requests;
    if (resp) {
      resp.Request.forEach((task: any) => {
        task.ShowRecall = 'Y';
        task.ShowReassign = 'Y';
        this.allRequests.push(task);
      })
    }
  }
  actOnRequest(action: string, data: any){
    this.selectedRequest = data;
    this.requestID = data.RequestNo;
    if(action == 'RECALL'){
      this.confirmationService.confirm({
        message: 'Confirm recalling the request ' + this.requestID + ' ?',
        header: 'Recall Request ' + this.requestID,
        icon: 'pi pi-exclamation-triangle',
        key: 'recalldialog',
        accept: () => {
          this.recallRequest();
        }
      });
    } else if (action == 'REASSIGN'){
      this.openModal(this.reassign,'xl-modal');
    }
  }
  recallRequest(){
    
  }
  reassignRequest(){
    this.isReqSubmitted = true;
  }
  onRequestSubmit(data: any) {
    if (data.status == 'SUCCESS') {
      this.hideModal();
      this.reqSubmit.emit({ ACTION: 'REASSIGN', STATUS: 'SUCCESS', REQUEST_ID: this.selectedRequest.RequestNo })
      this.utilService.alert('success', 'Success', 'Request ' + this.selectedRequest.RequestNo + ' reassigned successfully!!', false);
      this.getAllRequests();
      this.isReqSubmitted = false;
    } else {
      setTimeout(() => {
        this.isReqSubmitted = false;
      });
    }
  }
  hideModal() {
    this.modalRef.hide()
  }
  openModal(template: TemplateRef<any>, cssClass: string) {
    this.modalRef = this.modalService.show(template, {
      class: cssClass, keyboard: false,
      backdrop: true,
      ignoreBackdropClick: true
    });
  }
}
