import { DatePipe } from '@angular/common';
import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MenuItem } from 'primeng/api';
import { UtilityService } from './commons/utilities.service';
import { AppService } from './commons/app.service';

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
  bossList!: MenuItem[];
  bosses: any[] = [];
  showBoss: boolean = false;
  hideUserActions: boolean = true;
  searchText: string = "";
  isSearchClicked: boolean = false;
  sClickCount: number = 0;
  newTabRoutes: any[] = [];

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
      this.getBossInfo();
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
  getBossInfo(){
    //Service Implementation
    let response = {
      "PersonalAssistant":{"BossDN":"","I_PAExists":"false","PAName":"Priya_PA","BossName":"IAD_LO_3","I_PAName":"priya_pa","I_BossName":"iadlo3","PersonalAssistant-id":{"Id":"245764","ItemId":"002248573547A1ECAFB4939FF615681E.245764"},"PA":{"Person-id":{"Id":"163856389","ItemId":"F8B156B4FF8F11E6E6562305FE2BDF32.163856389"}},"Boss":{"Person-id":{"Id":"163905543","ItemId":"F8B156B4FF8F11E6E6562305FE2BDF32.163905543"}}}
    }
    let bList: any[] = [];
    let resp = response.PersonalAssistant;
    if(resp){
      bList.push({
        label: resp.BossName, command: () => {
          this.utilService.setBossDetails(resp.BossName, resp.BossDN);
        }
      })
      this.bosses.push(resp.BossName);
      this.showBoss = true;
    }
    this.bossList = bList
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
    this.isOOOEnabled = data;
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
  goToAdvSearch() {
    if(!this.utilService.isEmpty(this.searchText)){
      this.utilService.saveToStorage('SearchText', this.searchText);
      this.utilService.saveToStorage('SearchType', 'basic');
      this.utilService.pushRoute("search");
      this.isSearchClicked = false;
      this.searchText = '';
      this.sClickCount = 0;
    } else{
      this.utilService.alert('info', 'Information!!', 'Please enter search text to proceed further!!', false);
    }
  }
  openSearchText() {
    this.sClickCount++;
    if(this.sClickCount%2 == 0)
      this.isSearchClicked = false;
    else
      this.isSearchClicked = true;
  }
}
