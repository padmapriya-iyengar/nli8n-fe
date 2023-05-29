import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UtilityService } from '../commons/utilities.service';
import { OFFICER_DETAILS, REQUEST_REASSIGN } from '../entities/request-reassign';
import * as _ from "lodash";
import { AppService } from '../commons/app.service';

@Component({
  selector: 'request-reassign',
  templateUrl: './request-reassign.component.html',
  styleUrls: ['./request-reassign.component.scss']
})
export class RequestReassignComponent implements OnInit, OnChanges {

  @Input() modalSubmit: boolean = false;
  @Input() requestInfo!: any;
  @Output() reqSubmit = new EventEmitter<any>();
  formSubmitted: boolean = false;
  @ViewChild('reassignForm') reqForm!: NgForm;
  officerNames: any[] = []
  reqReassign!: REQUEST_REASSIGN;
  cOfficer!: OFFICER_DETAILS;
  officersList: any[] = [];
  officersCols: any[] = [];
  sOfficerIndex: number = -1;
  division: string = '';
  pOfficersList: any[] = [];

  constructor(private utilService: UtilityService, private appService: AppService) { }

  ngOnInit(): void {
    this.reqReassign = new REQUEST_REASSIGN();
    this.cOfficer = new OFFICER_DETAILS();
    this.officersCols = [
      { field: "OfficerName", label: "Name", type: "string"},
      { field: "OfficerDivision", label: "Division", type: "string"},
      { field: "IsMainOfficer", label: "Main Officer/Team Lead", type: "string"}
    ]
    this.reqReassign.ParentItemID = this.requestInfo.ItemId;
    this.loadOfficers();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['modalSubmit'].currentValue) {
      this.onSubmit()
    }
  }
  loadOfficers(){
    this.appService.getUsers().subscribe((response) => {
      let resp = Object.assign(response);
      if(resp){
        if(resp.length){
          resp.forEach((item:any) => {
            this.officerNames.push({ label: item.display_name, value: item.username })
          })
        } else{
          this.officerNames.push({ label: resp.display_name, value: resp.username })
        }
      }
    },
    (error) => {
      console.log('Request failed with error');
    })
  }
  onSubmit() {
    this.formSubmitted = true;
    if (this.officersList.length == 0) {
      this.reqSubmit.emit({ status: 'FAILURE' });
      this.utilService.alert('error', 'Error', 'Please add atleast one officer!!', false);
    } else if (_.filter(this.officersList, { 'IsMainOfficer': 'Yes' }).length == 0) {
      this.reqSubmit.emit({ status: 'FAILURE' });
      this.utilService.alert('error', 'Error', 'Please add atleast one main officer!!', false);
    } else {
      this.reqReassign.Officers = this.pOfficersList;
    }
    this.reqSubmit.emit({ status: 'SUCCESS' });
  }
  addOfficer(){
    if(this.utilService.isEmpty(this.cOfficer.OfficerCode)){
      this.utilService.alert('error','Error','Please select an officer to add!!', false);
    } else{
      let offCode = this.cOfficer.OfficerCode;
      let mainOff: string = '';
      let index = _.findIndex(this.officerNames, function (off) { return off.value == offCode; })
      let offName = this.officerNames[index].label
      if (this.cOfficer.IsMainOfficer){
        if(this.cOfficer.IsMainOfficer)
          mainOff = 'Yes'
        else
          mainOff = 'No'
      } else{
        mainOff = 'No'
      }
      let officer = {
        OfficerName: offName,
        OfficerCode: offCode,
        IsMainOfficer: mainOff,
        OfficerDivision: this.division
      }
      let oIndex = _.findIndex(this.officersList, function (offc) { return offc.OfficerName == officer.OfficerName; })
      if(oIndex == -1){
        let moIndex = _.findIndex(this.officersList, function (offc) { return offc.IsMainOfficer == 'Yes'; })
        if (moIndex == -1 || officer.IsMainOfficer == 'No') {
          this.officersList.push(officer)
          this.pOfficersList.push({ Officer: officer })
        } else {
          this.utilService.alert('error', 'Error', 'Main officer is already added, please uncheck the main officer!!', false);
        }
      } else{
        this.utilService.alert('error', 'Error', 'Selected officer is already added!!', false);
      }
      
    }
  }
  deleteOfficer(){
    if(this.sOfficerIndex == -1){
      this.utilService.alert('error', 'Error', 'Please select an officer to delete!!', false);
    } else{
      this.officersList.splice(this.sOfficerIndex,1)
      this.pOfficersList.splice(this.sOfficerIndex, 1)
    }
  }
  onRowSelected(data: any){
    this.sOfficerIndex = data.index;
  }
}
