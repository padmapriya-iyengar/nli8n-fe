import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as _ from "lodash";
import { UtilityService } from '../commons/utilities.service';
import { USER_PROFILE } from '../entities/user-profile';

@Component({
  selector: 'user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnChanges{
  @Input() userInfo!: any;
  @Output() oooEnable = new EventEmitter<any>();
  @Output() reqSubmit = new EventEmitter<any>();
  @Input() modalSubmit!: boolean;
  @ViewChild('upForm') upForm!: NgForm;

  constructor(private utilService: UtilityService, private datePipe: DatePipe) { }

  userHeader!: string;
  formattedUserName!: string;
  userRoles: any[] = [];
  todaysDate: Date = new Date();
  lastModifiedDate!: string;
  lastModifiedTime!: string;
  isOOOEnabled: boolean = false;
  formSubmitted: boolean = false;
  userProfile: any = {};

  ngOnInit(): void {
    this.userProfile = new USER_PROFILE();
    this.userHeader = _.upperCase(this.userInfo.DisplayName.substring(0,1));
    this.formattedUserName = _.capitalize(this.userInfo.DisplayName);
    this.loadUserDetails();
  }
  loadUserDetails(){
    this.userProfile.DateFrom = this.userInfo.DateFrom ? new Date(this.userInfo.DateFrom) : null;
    this.userProfile.DateUntil = this.userInfo.DateUntil ? new Date(this.userInfo.DateUntil) : null;
    this.userProfile.DepartmentName = this.userInfo.DepartmentName;
    this.userProfile.Email = this.userInfo.Email;
    this.userProfile.ItemID = this.userInfo.ItemID;
    this.userProfile.OutOfOfficeMessage = this.userInfo.OutOfOfficeMessage;
    this.userProfile.OutOfOffice = this.userInfo.OutOfOffice == 'true' ? true : false;
    this.userProfile.ReceiveEmailNotifications = this.userInfo.ReceiveEmailNotifications == 'true' ? true : false;
    if (this.userProfile.OutOfOffice){
      this.isOOOEnabled = true;
    } else{
      this.isOOOEnabled = false;
    }
    this.userInfo.Roles.forEach((role: any) => {
      this.userRoles.push(role)
    })
    this.oooEnable.emit(this.isOOOEnabled);
    if (!this.utilService.isEmpty(this.userProfile.DateUntil)){
      if (new Date(this.userInfo.DateUntil) < new Date()){
        this.removeOOO();
      }
    }
  }
  actOnOOO(data:any){
    this.oooEnable.emit(data.checked);
    if(data.checked){
      this.isOOOEnabled = true;
    } else{
      this.isOOOEnabled = false;
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['modalSubmit'].currentValue) {
      this.onSubmit()
    }
  }
  onSubmit() {
    this.formSubmitted = true;
    if (this.upForm && !this.upForm.valid) {
      this.reqSubmit.emit({ status: 'FAILURE' });
      this.utilService.alert('error', 'Error', 'Please fill all mandatory details!!', false);
    } else {
      let user_profile: any = _.cloneDeep(this.userProfile);
      user_profile.DateFrom = user_profile.DateFrom ? this.datePipe.transform(user_profile.DateFrom, "yyyy-MM-dd'T'hh:mm:ss") : null;
      user_profile.DateUntil = user_profile.DateUntil ? this.datePipe.transform(user_profile.DateUntil, "yyyy-MM-dd'T'hh:mm:ss") : null;
    }
  }
  removeOOO(){
    
  }
}