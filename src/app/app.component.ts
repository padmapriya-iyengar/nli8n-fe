import { DatePipe } from '@angular/common';
import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MenuItem } from 'primeng/api';
import { UtilityService } from './commons/utilities.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements OnInit{
  constructor(private modalService: BsModalService, private router: Router, 
    private utilService: UtilityService, private datePipe: DatePipe) { }
  modalRef!: BsModalRef;
  userActions!: MenuItem[];
  userManagementInfo: any = {}
  requestType: string = '';
  reqItemID: string = '';
  @ViewChild('userProfileModal') userProfile!: TemplateRef<any>;
  @ViewChild('logoutModal') userLogout!: TemplateRef<any>;
  currentUserName: string = '';
  currentUserDN: string = '';
  currentUserItemID: string = '';
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
    //Service Implementation
    let response = {
      "UserProfile":{"ContactNumber":{"@nil":"true"},"DisplayName":"Priya","OutOfOfficeMessage":{"@nil":"true"},"Name":"priya","DateFrom":{"@nil":"true"},"DepartmentName":"IAD","ReceiveEmailNotifications":"false","OutOfOffice":"false","LastUpdatedBy":"priya","LastUpdatedOn":"2022-11-02T08:48:58Z","UserID":"priya","DateUntil":{"@nil":"true"},"Email":{"@nil":"true"},"UserProfile-id":{"Id":"213000","ItemId":"002248573547A1ECA6E5D79B37C2E81A.213000"}},"FunctionalGroup":[{"FunctionalGroup-id":{"Id":"49155","ItemId":"002248573547A1ECA0C26352C534A817.49155"},"GroupName":"IAD","GroupCreatedInOTDS":"Yes","IsDivision":"true","IsChild":"No","GroupDescription":"International Affairs Division","GroupType":"Functional","UserLinkedToGroup":{"@nil":"true"},"Status":"A","Title":{"Value":"IAD"}},{"FunctionalGroup-id":{"Id":"180226","ItemId":"002248573547A1ECA0C26352C534A817.180226"},"GroupName":"Migration Data Admin","GroupCreatedInOTDS":"No","IsDivision":"false","IsChild":"Yes","GroupDescription":"Migration Data Admin","GroupType":"Functional","UserLinkedToGroup":"No","Status":"A","Title":{"Value":"Migration Data Admin"}},{"FunctionalGroup-id":{"Id":"163843","ItemId":"002248573547A1ECA0C26352C534A817.163843"},"GroupName":"SECURITY ADMIN","GroupCreatedInOTDS":"No","IsDivision":"false","IsChild":"Yes","GroupDescription":"Security Administrator","GroupType":"Functional","UserLinkedToGroup":"No","Status":"A","Title":{"Value":"SECURITY ADMIN"}},{"FunctionalGroup-id":{"Id":"1","ItemId":"002248573547A1ECA0C26352C534A817.1"},"GroupName":"AGC","GroupCreatedInOTDS":"Yes","IsDivision":"false","IsChild":"No","GroupDescription":"Attorney General Chambers","GroupType":"Functional","UserLinkedToGroup":{"@nil":"true"},"Status":"A","Title":{"Value":"AGC"}},{"FunctionalGroup-id":{"Id":"49156","ItemId":"002248573547A1ECA0C26352C534A817.49156"},"GroupName":"REGISTRY (IAD)","GroupCreatedInOTDS":"Yes","IsDivision":"false","IsChild":"Yes","GroupDescription":"Registry team of IAD","GroupType":"Functional","UserLinkedToGroup":{"@nil":"true"},"Status":"A","Title":{"Value":"REGISTRY (IAD)"}}]
    }
    let resp = response.UserProfile;
    let roles = response.FunctionalGroup;
    this.removeNilAttribute(resp);
    UtilityService.CURRENT_USER_ITEM_ID = resp['UserProfile-id']['ItemId'];
    UtilityService.IS_USER_PROFILE_TRIGGERED = true;
    UtilityService.CURRENT_USER_INBOX_PREF=[{"field":"TASK_ACTION","label":"Action","type":"string","spanWidth":"1","isSelected":true,"display":true,"spanWidthPx":"100"},{"field":"TASK_TITLE","label":"Title","type":"string","spanWidth":"2","isSelected":true,"display":true,"spanWidthPx":"200"},{"field":"FILE_TITLE","label":"File Title","type":"string","spanWidth":"1","isSelected":true,"display":true,"spanWidthPx":"200"},{"field":"FILE_REF_NO","label":"Ref No.","type":"string","spanWidth":"1","isSelected":true,"display":true,"spanWidthPx":"200"},{"field":"REQUEST_ID","label":"Req ID","type":"string","spanWidth":"1","isSelected":true,"display":true,"spanWidthPx":"100"},{"field":"DELIVERY_DATE","label":"Received Date","type":"datetime","spanWidth":"2","isSelected":true,"display":true,"spanWidthPx":"200"},{"field":"CIRCULATION_ID","label":"Circulation ID","type":"string","spanWidth":"2","isSelected":true,"display":true,"spanWidthPx":"200"},{"field":"REQUEST_DUE_DATE","label":"Due Date","type":"date","spanWidth":"2","isSelected":true,"display":true,"spanWidthPx":"200"},{"field":"EXPECTED_RESPONSE_DATE","label":"Expected Response Date","type":"date","spanWidth":"2","isSelected":true,"display":true,"spanWidthPx":"200"},{"field":"TASK_STATUS","label":"Status","type":"string","spanWidth":"1","isSelected":true,"display":true,"spanWidthPx":"100"},{"field":"TASK_FROM","label":"From","type":"string","spanWidth":"1","isSelected":true,"display":true,"spanWidthPx":"100"}]
    this.currentUserItemID = UtilityService.CURRENT_USER_ITEM_ID;
    this.userInfo = {
      DisplayName: resp.DisplayName,
      UserDN: this.currentUserDN,
      Email: resp.Email,
      DepartmentName: resp.DepartmentName,
      LastUpdatedOn: this.datePipe.transform(resp.LastUpdatedOn.split("T")[0], 'MMM d, y'),
      LastUpdatedTime: resp.LastUpdatedOn.split("T")[1].substring(0, 5),
      ItemID: this.currentUserItemID,
      ReceiveEmailNotifications: resp.ReceiveEmailNotifications,
      OutOfOffice: resp.OutOfOffice,
      DateFrom: resp.DateFrom,
      DateUntil: resp.DateUntil,
      OutOfOfficeMessage: resp.OutOfOfficeMessage,
      Roles: []
    }
    if(roles){
      if(roles.length > 0){
        roles.forEach((role:any) => {
          if (role.IsDivision == 'false')
            this.userInfo.Roles.push({ label: role.Title.Value, value: role.Title.Value })
        })
      }
    }
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
