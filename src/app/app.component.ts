import { DatePipe } from '@angular/common';
import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MenuItem } from 'primeng/api';
import { UtilityService } from './commons/utilities.service';
import { AppService } from './commons/app.service';
import { NOTIFICATION_DETAILS } from './entities/notification-details';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements OnInit{
  constructor(private modalService: BsModalService, private router: Router, 
    private utilService: UtilityService, private datePipe: DatePipe, private appService: AppService) { }
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
  notfCount:any;

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
          this.openModal(this.userLogout, 'md-modal');
        }
      }
    ];
    this.utilService.userActions.subscribe((details:any) => {
      this.hideUserActions = details;
    })
    this.utilService.cUserName.subscribe((userDetails:any) => {
      this.currentUserName = userDetails.UserName;
      this.currentUserDN = userDetails.UserDN;
      this.getAllNotifications(this.currentUserName)
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
    this.userInfo = UtilityService.CURRENT_USER_INFO
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
  getAllNotifications(username:string){
    this.allNotifications = [];
    this.appService.getUserNotifications(username).subscribe({ next: (response) => {
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
                TaskEntityInstanceID: ''
              })
            }
          })
        }
        this.notfCount = this.allNotifications.length;
      }
    },
    error: (error) => {
      console.error('Request failed with error')
      this.showSpinner = false;
    }})
  }
  openNotfModal(template: TemplateRef<any>, cssClass: string) {
    this.modalRef = this.modalService.show(template, {
      class: cssClass, keyboard: false,
      backdrop: true,
      ignoreBackdropClick: true
    });
  }
  hideNotfModal(){
    this.getAllNotifications(this.currentUserName);
    this.modalRef.hide();
  }
}
