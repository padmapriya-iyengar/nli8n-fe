import { DatePipe } from "@angular/common";
import { EventEmitter, Injectable } from "@angular/core";
import * as _ from "lodash";
import { MessageService } from "primeng/api";
import { Observable } from "rxjs";

@Injectable()
export class UtilityService{
    constructor(private message: MessageService, private datePipe: DatePipe){
        this.storage = localStorage;
    }
    public route: EventEmitter<any> = new EventEmitter();
    private storage!: Storage;
    public static CURRENT_USER_NAME: string = "";
    public static CURRENT_USER_DN: string = "";
    public static CURRENT_USER_ITEM_ID: string = "";
    public static CURRENT_USER_INBOX_PREF: any;
    public static IS_USER_PROFILE_TRIGGERED: boolean = false;
    public static CURRENT_USER_INFO: any = {};
    public cUserName: EventEmitter<any> = new EventEmitter();
    public userActions: EventEmitter<any> = new EventEmitter();
    public dashboardServ: EventEmitter<any> = new EventEmitter();
    public pushToMenu: EventEmitter<any> = new EventEmitter();
    public clearMenu: EventEmitter<any> = new EventEmitter();
    public fileDetails: EventEmitter<any> = new EventEmitter();
    public rowDetails: EventEmitter<any> = new EventEmitter();
    public pageNo: EventEmitter<any> = new EventEmitter();
    public fileSource: EventEmitter<any> = new EventEmitter();
    public BREADCRUMB: any[] = [];

    applyLikeFilter(array: any[] , reqKey: any, reqValue: string): any[]{
        let fArray: any[] = [];
        let cObj: any = {};
        _.forEach(array, function (value) {
            cObj = _.cloneDeep(value);
            if (_.includes(_.lowerCase(cObj[reqKey]), _.lowerCase(reqValue))){
                fArray.push(cObj)
            }
        });
        return fArray;
    }
    pushRoute(url: string){
        this.route.next(url);
    }
    getUserName(userDetails: any) {
        this.cUserName.next(userDetails);
    }
    public saveToStorage(key: any, value: any) {
        value = JSON.stringify(value);
        this.storage.setItem(key, value);
    }
    public readFromStorage(key: any): any {
        const value = this.storage.getItem(key) || "{}";
        return JSON.parse(value);
    }
    public removeFromStorage(key: any) {
        return this.storage.removeItem(key);
    }
    public clearFromStorage() {
        this.storage.clear();
    }
    public getUserId(): string {
        let userObj:any = this.storage.getItem('userObj') || '';
        userObj = userObj ? JSON.parse(userObj) : "";
        let userId = (userObj['user'] && userObj['user']['id']) ? userObj['user']['id'] : '';
        return userId;
    }
    public isEmpty(reqString: string): boolean {
        reqString = _.trim(reqString);
        if(reqString === '' || reqString == null || reqString.length == 0){
            return true;
        }
        return false;
    }
    public alert(severity: string, summary: string, detail: string, sticky: boolean){
        this.message.clear();
        this.message.add({ severity: severity, summary: summary, detail: detail, sticky: sticky });
    }
    setUserActions(details: any) {
        this.userActions.next(details);
    }
    reloadDashboard(servIdentifier: string) {
        this.dashboardServ.next(servIdentifier);
    }
    pushToBreadcrumb(label: string, icon: string, routerLink: string, queryParams: any, commandType: string, commandDesc: string, styleClass: string) {
        this.pushToMenu.next({ label: label, icon: icon, routerLink: routerLink, queryParams: queryParams, commandType: commandType, commandDesc: commandDesc, styleClass: styleClass });
        this.BREADCRUMB.push({ label: label, icon: icon, routerLink: routerLink, queryParams: queryParams, commandType: commandType, commandDesc: commandDesc, styleClass: styleClass });
    }
    clearBreadcrumb() {
        this.clearMenu.next({});
        this.BREADCRUMB = [];
    }
    clearBreadcrumbAfterIndex(breadcrumb: any,index: number):any[] {
        let cBreadCrumb = _.cloneDeep(breadcrumb);
        cBreadCrumb.splice(index+1)
        return cBreadCrumb;
    }
    transferFileData(fileData: any) {
        this.fileDetails.next({ fileData });
    }
    transferRowData(rowData: any) {
        this.rowDetails.next({ rowData });
    }
    getBreadCrumb(){
        return this.BREADCRUMB;
    }
    changeCurrentPageNumber(pageNumber: any) {
        this.pageNo.next({ cPage: pageNumber });
    }
    setFileReportSource(fileSource: any){
        this.fileSource.next({FILE_SOURCE: fileSource});
    }
    addDays(date:any,days:any,object:any,attribute:string){
        date.setDate(date.getDate() + days);
        object[attribute]=date;
    }
}