import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { UtilityService } from '../commons/utilities.service';

@Component({
  selector: 'request-reopen',
  templateUrl: './request-reopen.component.html',
  styleUrls: ['./request-reopen.component.scss']
})
export class RequestReopenComponent implements OnInit {
  constructor(private confirmationService: ConfirmationService,
    private utilService: UtilityService) { }

  allRequests: any[] = [];
  reqReopenCols: any[] = [];
  selectedRequest: any = {};
  requestID: string = "";
  @Output() reqSubmit = new EventEmitter<any>();

  ngOnInit(): void {
    this.reqReopenCols = [
      { field: "RequestNo", label: "Request ID", type: "string", spanWidth: "1" },
      { field: "I_MainFileRefNo", label: "File Ref No.", type: "string", spanWidth: "1" },
      { field: "RequestTitle", label: "Request Title", type: "string", spanWidth: "2" },
      { field: "ReceivedDate", label: "Received Date", type: "date", spanWidth: "1" },
      { field: "RequestClosedDate", label: "Closed Date", type: "date", spanWidth: "1" },
      { field: "NoOfDays", label: "No. of days left to archive", type: "string", spanWidth: "1" },
    ]
    this.getAllRequests();
  }
  getAllRequests(){
    this.allRequests = [];
    let response = {"tuple":{"old":{"getRequestsByRequestState":{"getRequestsByRequestState":{"Requests":{"Request":[{"RequestTitle":"IAD Adv File Testing 14-11-2022","I_MainFileRefNo":"AG/IAD/AIR/1/2022/000000042","RequestNo":"ADV000000129","ReceivedDate":"2022-11-14T12:32:26.0","RequestClosedDate":"2022-11-18T12:32:26.0","NoOfDays":"3"},{"RequestTitle":"Demo Test 2-11-2022","I_MainFileRefNo":"AG/IAD/AIR/FIRS/2022/000000008","RequestNo":"ADV000000091","ReceivedDate":"2022-11-02T09:16:48.400000000","RequestClosedDate":"2022-11-13T12:32:26.0","NoOfDays":"4"},{"RequestTitle":"Test for MLA request - Demo - 001","I_MainFileRefNo":"AG/IAD/MLA-T/HK/2022/000000001","RequestNo":"MLA000000001","ReceivedDate":"2022-08-23T06:20:17.350000000","RequestClosedDate":"2022-11-18T12:32:26.0","NoOfDays":"6"},{"RequestTitle":"Request for File Security 1","I_MainFileRefNo":"AG/IAD/AIR/1/2022/000000003","RequestNo":"ADV000000004","ReceivedDate":"2022-08-23T06:18:23.550000000","RequestClosedDate":"2022-11-28T12:32:26.0","NoOfDays":"4"},{"RequestTitle":"TEst for request documents security","I_MainFileRefNo":"AG/IAD/AIR/1/2022/000000026","RequestNo":"ADV000000070","ReceivedDate":"2022-08-23T05:46:55.950000000","RequestClosedDate":"2022-11-25T12:32:26.0","NoOfDays":"2"},{"RequestTitle":"Demo Request 3","I_MainFileRefNo":"AG/IAD/AIR-C/1/2022/000000005","RequestNo":"ADV000000083","ReceivedDate":"2022-08-17T04:45:27.627000000","RequestClosedDate":"2022-11-18T12:32:26.0","NoOfDays":"1"},{"RequestTitle":"TEst for request history","I_MainFileRefNo":"AG/IAD/AIR-C/FIRS/2022/000000001","RequestNo":"ADV000000066","ReceivedDate":"2022-08-11T10:31:28.027000000","RequestClosedDate":"2022-11-18T12:32:26.0","NoOfDays":"10"},{"RequestTitle":"","I_MainFileRefNo":"AG/IAD/AIR/1/2022/000000038","RequestNo":"","ReceivedDate":"2022-07-12T02:19:16.473000000","RequestClosedDate":"2022-11-19T12:32:26.0","NoOfDays":"11"},{"RequestTitle":"Test for sla breach","I_MainFileRefNo":"AG/IAD/AIR/2/2022/000000001","RequestNo":"ADV000000038","ReceivedDate":"2022-07-05T11:12:34.910000000","RequestClosedDate":"2022-11-13T12:32:26.0","NoOfDays":"12"},{"RequestTitle":"Request for Actions","I_MainFileRefNo":"AG/IAD/MLA-T/HK/2022/000000010","RequestNo":"MLA000000006","ReceivedDate":"2022-07-05T07:51:46.300000000","RequestClosedDate":"2022-11-16T12:32:26.0","NoOfDays":"17"},{"RequestTitle":"Request for actions check 2","I_MainFileRefNo":"AG/IAD/AIR/2/2021/000000001","RequestNo":"ADV000000040","ReceivedDate":"2022-07-01T09:06:18.150000000","RequestClosedDate":"2022-11-18T12:32:26.0","NoOfDays":"14"}]}}}}}}
    let resp = response.tuple.old.getRequestsByRequestState.getRequestsByRequestState.Requests;
    if (resp.Request){
      if(!resp.Request.length){
        this.allRequests.push(resp.Request)
      } else if(resp.Request.length > 0){
        resp.Request.forEach((req: any) => {
          this.allRequests.push(req)
        })
      }
    }
  }
  actOnRequest(action: string, data: any) {
    this.selectedRequest = data;
    this.requestID = data.RequestNo;
    if (action == 'REOPEN') {
      this.confirmationService.confirm({
        message: 'Confirm reopening the request ' + this.requestID + ' ?',
        header: 'Reopen Request ' + this.requestID,
        icon: 'pi pi-exclamation-triangle',
        key:"reopendialog",
        accept: () => {
          this.reopenRequest();
        }
      });
    }
  }
  reopenRequest(){
    this.reqSubmit.emit({ STATUS: 'SUCCESS', REQUEST_ID: this.selectedRequest.RequestNo })
    this.utilService.alert('success', 'Success', 'Request ' + this.selectedRequest.RequestNo + ' reopened successfully!!', false);
  }
}
