import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as _ from "lodash";
import { UtilityService } from '../../services/utilities.service';
import { USER_PROFILE } from '../../../entities/user-profile';
import { AppService } from '../../services/app.service';

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

  constructor(private utilService: UtilityService, private datePipe: DatePipe, private appService: AppService) { }

  userHeader!: string;
  formattedUserName!: string;
  userDivisions: any[] = [];
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
    this.userProfile.OutOfOffice = this.userInfo.OutOfOffice;
    this.userProfile.ReceiveEmailNotifications = this.userInfo.ReceiveEmailNotifications;
    if (this.userProfile.OutOfOffice){
      this.isOOOEnabled = true;
    } else{
      this.isOOOEnabled = false;
    }
    this.userInfo.Roles.forEach((role: any) => {
      this.userDivisions.push(role)
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
      user_profile.ooo_date_from = user_profile.DateFrom ? this.datePipe.transform(user_profile.DateFrom, "yyyy-MM-dd'T'hh:mm:ss") : null;
      user_profile.ooo_date_until = user_profile.DateUntil ? this.datePipe.transform(user_profile.DateUntil, "yyyy-MM-dd'T'hh:mm:ss") : null;
      user_profile.ooo_message = user_profile.OutOfOfficeMessage;
      user_profile.ooo = user_profile.OutOfOffice == true ? '1' : '0';
      user_profile.email_notifications = user_profile.ReceiveEmailNotifications == true ? '1' : '0'
    
      this.appService.updateUserProfile(UtilityService.CURRENT_USER_NAME,user_profile).subscribe({next: (response) => {
        let resp = Object.assign(response)
        if(resp){
          this.reqSubmit.emit({status:'SUCCESS'})
          this.oooEnable.emit({value: user_profile.OutOfOffice})
        }
      },
      error: (error)=>{
        console.error('Request failed with error')
        this.reqSubmit.emit({status:'FAILURE'})
      }
    })
      }
  }
  removeOOO(){
    let user_profile: any = _.cloneDeep(this.userProfile);
    this.userProfile.ooo_message = null
    this.userProfile.ooo_date_from = null
    this.userProfile.ooo_data_until = null
    this.userProfile.ooo = false;
  }
}