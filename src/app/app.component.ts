import { DatePipe } from '@angular/common';
import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MenuItem } from 'primeng/api';
import { UtilitiesService } from './commons/services/utilities.service';
import { NOTIFICATION_DETAILS } from './entities/notification-details';
import { AgcService } from './commons/services/agc.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements OnInit{
  constructor(private modalService: BsModalService, private router: Router, 
    private utilService: UtilitiesService, private datePipe: DatePipe, private agcService: AgcService) { }
  modalRef!: BsModalRef;
  userActions!: MenuItem[];
  userManagementInfo: any = {}
  requestType: string = '';
  reqItemID: string = '';
  @ViewChild('userProfileModal') userProfile!: TemplateRef<any>;
  @ViewChild('logoutModal') userLogout!: TemplateRef<any>;
  currentUserName: string = '';
  currentUserDN: string = '';
  userInfo: any = {};
  isOOOEnabled: boolean = false;
  isReqSubmitted: boolean = false;
  hideUserActions: boolean = true;
  searchText: string = "";
  isSearchClicked: boolean = false;
  sClickCount: number = 0;
  newTabRoutes: any[] = [];
  showSpinner: boolean = false;
  allNotifications: NOTIFICATION_DETAILS[] = [];
  notfCount:any = 0;

  title = 'InterviewDemo'
  
  ngOnInit(): void {   
    this.newTabRoutes.push('migration','docUpload')
    this.initialize();
  }
  initialize(){
    this.utilService.route.subscribe((route:any) => {
      if (_.indexOf(this.newTabRoutes, route) != -1) {
        this.utilService.setUserActions(false);
        window.open('#/' + route)
      } else {
        this.goToURL(route);
      }
    })
    this.userActions = [
      {
        label: 'User Profile', command: () => {
          this.getUserInfo();
        }
      },
      {
        label: 'Signout', command: () => {
          this.openModal(this.userLogout, 'sm-modal');
        }
      }
    ];
    this.utilService.userActions.subscribe((details:any) => {
      this.hideUserActions = details;
    })
    this.utilService.cUserName.subscribe((userDetails:any) => {
      this.currentUserName = userDetails.UserName;
      this.currentUserDN = userDetails.UserDN;
    })
    this.utilService.userNotfs.subscribe((allNotifications:any) => {
      this.getAllNotifications(allNotifications,this.currentUserName)
    })
    if (this.utilService.readFromStorage('IS_LOGGEDIN') != true) {
      this.goToURL('');
    } else {
      let url = window.location.href;
      if (!_.includes(window.location.href, '#')) {
        url = url + "/#/"
      }
      this.goToURL(url);
    }
  }
  goToURL(url: string) {
    let routeName = url;
    if(_.includes(url,'#')){
      routeName = url.split('#')[1];
    }
    this.router.navigate([routeName]);
  }
  getUserInfo(){
    this.userInfo = UtilitiesService.CURRENT_USER_INFO
    this.openModal(this.userProfile, 'md-modal');
  }
  openModal(template: TemplateRef<any>, cssClass: string) {
    this.modalRef = this.modalService.show(template, {
      class: cssClass, keyboard: false,
      backdrop: true,
      ignoreBackdropClick: true
    });
  }
  hideModal() {
    this.modalRef.hide()
  }
  logMeOut(){
    this.hideModal();
    localStorage.clear();
    this.utilService.setUserActions(true);
    this.utilService.saveToStorage("IS_LOGGEDIN",false)
    this.utilService.pushRoute('login');
  }
  onOOOEnable(data: any){
    this.isOOOEnabled = data.value;
  }
  updateUserProfile(){
    this.isReqSubmitted = true;
  }
  onRequestSubmit(data: any) {
    if (data.status == 'SUCCESS') {
      this.hideModal();
      this.utilService.alert('success', 'Success', 'User profile updated successfully!!', false);
      this.isReqSubmitted = false;
    } else {
      setTimeout(() => {
        this.isReqSubmitted = false;
      });
    }
    this.reloadUserProfile();
  }
  reloadUserProfile(){
    let divisions: any = [];
    let roles: any[] = [];
    let userInfo: any = {}
    this.agcService.getUserInfo(UtilitiesService.CURRENT_USER_NAME).subscribe({next: (response) => {
      let resp = Object.assign(response)
      divisions = resp[0].agc_user_divisions
      let inboxPref = [];
      if(resp){
        UtilitiesService.CURRENT_USER_ITEM_ID = resp[0].username;
        UtilitiesService.IS_USER_PROFILE_TRIGGERED = true;
        inboxPref = resp[0].agc_user_profile.inbox_preference;
        UtilitiesService.CURRENT_USER_INBOX_PREF=inboxPref;
        UtilitiesService.CURRENT_USER_DN = resp[0].username
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
        UtilitiesService.CURRENT_USER_INFO = userInfo;
      }
      this.utilService.pushRoute('dashboard');
    },
    error: (error) => {
      console.error('Request failed with error')
    }
  })
  }
  removeNilAttribute(jsonObject: any){
    let keys: any[] = _.keys(jsonObject);
    keys.forEach((key:any) => {
      if (jsonObject[key]["@nil"]){
        delete jsonObject[key]["@nil"];
        jsonObject[key] = null;
      }
    })
  }
  getAllNotifications(allNotfs:any[], username:string){
    this.allNotifications = [];
    let resp = allNotfs.filter((ntf) => ntf.responder === username)
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
              CreatedDate: this.datePipe.transform(item.created_on.split('T')[0], 'MMM d, y'),
              ModifiedDate: item.modified_on,
              MessageReadStatus: item.message_read_status,
              UserGroup: item.user_group,
              CreatedTime: item.created_on.split('T')[1].substring(0, 5),
              ShowRead: item.message_read_status == 'NotRead' ? true : false,
              ShowDelete: item.status == 'A' ? true : false,
              ShowNotf: item.status == 'A' ? true : false,
              NotfHeader: _.capitalize(item.actor ? item.actor.substring(0, 1) : item.responder.substring(0, 1)),
              StyleClass: item.message_read_status == 'Read' ? 'notf-row' : 'read-notf-row',
              RequestState: item.request_state,
              SourceItemId: item.source_item_id,
              LayoutID: '',
              TaskEntityInstanceID: '',
              CreatedOn: item.created_on
            })
          }
        })
      }
      this.notfCount = this.allNotifications.length;
    }
  }
  openNotfModal(template: TemplateRef<any>, cssClass: string) {
    this.modalRef = this.modalService.show(template, {
      class: cssClass, keyboard: false,
      backdrop: true,
      ignoreBackdropClick: true
    });
  }
  hideNotfModal(){
    this.modalRef.hide();
  }
}
