import { Component,OnInit } from '@angular/core';
import { UtilityService } from '../../services/utilities.service';
import { ConfirmationService } from 'primeng/api';
import { AppService } from '../../services/app.service';
import { DatePipe } from '@angular/common';
import { Subject, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  constructor(private utilService: UtilityService, private confirmationService: ConfirmationService,
    private appService: AppService, private datePipe: DatePipe) { }
  userName: string="";
  password: string="";

  ngOnInit(): void {
    this.utilService.setUserActions(true);
  }
  login(){
    let details = {
      username: this.userName,
      password: this.password
    }
    this.appService.login(details).subscribe({next: (response) =>{
        let resp = Object.assign(response)
        if(resp.status == 'FAIL' || resp.status == 'NO_USER'){
          this.utilService.alert('error',resp.message,resp.details,false)
        } else{
          this.loadDashboard()
        }
      },
      error: (error) => {
        console.log('Request failed with error');
      }
    })
  }
  loadDashboard(){
    if(this.utilService.isEmpty(this.userName) || this.utilService.isEmpty(this.password)){
      this.utilService.alert('error', 'Error', 'Please enter your username and password!!', false);
      return;
    }
    this.utilService.setUserActions(false);
    this.utilService.saveToStorage("IS_LOGGEDIN",true)

    UtilityService.CURRENT_USER_NAME = this.userName;
    UtilityService.IS_USER_PROFILE_TRIGGERED = false;

    let divisions: any = [];
    let roles: any[] = [];
    let userInfo: any = {}
    this.appService.getUserInfo(this.userName).subscribe({next: (response) => {
      let resp = Object.assign(response)
      divisions = resp[0].agc_user_divisions
      let inboxPref = [];
      if(resp){
        UtilityService.CURRENT_USER_ITEM_ID = resp[0].username;
        UtilityService.IS_USER_PROFILE_TRIGGERED = true;
        inboxPref = resp[0].agc_user_profile.inbox_preference;
        UtilityService.CURRENT_USER_INBOX_PREF=inboxPref;
        UtilityService.CURRENT_USER_DN = resp[0].username
        userInfo = {
          DisplayName: resp[0].display_name,
          UserDN: resp[0].username,
          Email: resp[0].agc_user_profile.email,
          DepartmentName: resp[0].agc_user_profile.department,
          LastUpdatedOn: this.datePipe.transform(resp[0].agc_user_profile.updated_on.split("T")[0], 'MMM d, y'),
          LastUpdatedTime: resp[0].agc_user_profile.updated_on.split("T")[1].substring(0, 5),
          ItemID: resp[0].username,
          ReceiveEmailNotifications: resp[0].agc_user_profile.email_notifications==1?true:false,
          OutOfOffice: resp[0].agc_user_profile.ooo==1?true:false,
          DateFrom: resp[0].agc_user_profile.ooo_date_from,
          DateUntil: resp[0].agc_user_profile.ooo_date_until,
          OutOfOfficeMessage: resp[0].agc_user_profile.ooo_message,
          Roles: []
        }
        if(divisions){
          if(divisions.length){
            divisions.forEach((item:any) => {
              userInfo.Roles.push({ label: item.group_name, value: item.title })
            })
          } else{
            userInfo.Roles.push({ label: divisions.group_name, divisions: divisions.title })
          }
        }
        UtilityService.CURRENT_USER_INFO = userInfo;
      }
      this.utilService.pushRoute('dashboard');
    },
    error: (error) => {
      console.error('Request failed with error')
    }
  })
  }
}
