import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError, from } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { api } from "src/config/api-url";
import { environment } from "src/environments/environment";

@Injectable()
export class AppService {
    constructor(private http: HttpClient) { }
    apiURL:any = api;
    apiEndpoint: any = environment.api_endpoint;

    getMasterDataByType(type:string) {
        return from(this.http.get(this.apiEndpoint + this.apiURL.get_master_data+'?source=type&identifier='+type));
    }
    getMasterDataByTypeAndParent(type:string,parent_code:string) {
        return this.http.get(this.apiEndpoint + this.apiURL.get_master_data+'?source=type_parent&identifier='+type+'&parent_code='+parent_code);
    }
    getMasterDataByCode(code:string) {
        return this.http.get(this.apiEndpoint + this.apiURL.get_master_data+'?source=code&identifier='+code);
    }
    getMasterDataByTypes(types:string) {
        return this.http.get(this.apiEndpoint + this.apiURL.get_master_data+'?source=types&identifier='+types);
    }
    getMasterDataByCodes(codes:string) {
        return this.http.get(this.apiEndpoint + this.apiURL.get_master_data+'?source=codes&identifier='+codes);
    }
    getUserNotifications(username:string){
        return this.http.get(this.apiEndpoint + this.apiURL.user_notifications+'?username='+username);
    }
    updateUserNotifications(id:string,action:string){
        return this.http.post(this.apiEndpoint + this.apiURL.user_notifications+'?id='+id,{action: action});
    }
    getUserDivisions(username:string){
        return this.http.get(this.apiEndpoint + this.apiURL.user_divisions+'?username='+username);
    }
    getUsers(){
        return this.http.get(this.apiEndpoint + this.apiURL.users);
    }
    getUserProfile(username:string){
        return this.http.get(this.apiEndpoint + this.apiURL.user_profile+'?username='+username);
    }
    getUserInfo(username:string){
        return this.http.get(this.apiEndpoint + this.apiURL.user_details+'?username='+username);
    }
    getSequence(type:string){
        return this.http.get(this.apiEndpoint + this.apiURL.sequence+'?type='+type);
    }
    generateSequence(type:string){
        return this.http.post(this.apiEndpoint + this.apiURL.sequence+'?type='+type,{});
    }
    updateUserProfile(username:string, userdata:any){
        return this.http.post(this.apiEndpoint + this.apiURL.user_profile+'?username='+username, {data: userdata});
    }
    getFileDetails(fileNo:string){
        return this.http.get(this.apiEndpoint + this.apiURL.file_details+'?fileReferenceNo='+fileNo)
    }
    readFile(fileNo:string){
        return this.http.get(this.apiEndpoint + this.apiURL.read_file+'?fileReferenceNo='+fileNo)
    }
    createFile(fileData:any){
        return this.http.post(this.apiEndpoint + this.apiURL.create_file, {data: fileData});
    }
    allFiles(){
        return this.http.get(this.apiEndpoint + this.apiURL.all_files);
    }
    getFile(fileNo:string){
        return this.http.get(this.apiEndpoint + this.apiURL.get_file+'?source=reference&identifier='+fileNo)
    }
    getFileByFilter(source:string, filterValue:string){
        return this.http.get(this.apiEndpoint + this.apiURL.get_file+'?source='+source+'&identifier='+filterValue)
    }
    getFilesForRequest(reqNo:string){
        return this.http.get(this.apiEndpoint + this.apiURL.files_for_request+'?requestNo='+reqNo)
    }
    readRequest(reqNo:string){
        return this.http.get(this.apiEndpoint + this.apiURL.read_request+'?requestNo='+reqNo)
    }
    createRequest(fileNo:string, reqData:any){
        return this.http.post(this.apiEndpoint + this.apiURL.create_request+'?fileReferenceNo='+fileNo, {data: reqData});
    }
    allRequests(){
        return this.http.get(this.apiEndpoint + this.apiURL.all_requests);
    }
    getRequest(reqNo:string){
        return this.http.get(this.apiEndpoint + this.apiURL.get_file+'?requestNo='+reqNo)
    }
    getRequestDetails(reqNo:string){
        return this.http.get(this.apiEndpoint + this.apiURL.request_details+'?requestNo='+reqNo)
    }
    getRequestsForFile(fileNo:string){
        return this.http.get(this.apiEndpoint + this.apiURL.requests_for_file+'?fileReferenceNo='+fileNo)
    }
    getFilesForDashboard(){
        return this.http.get(this.apiEndpoint + this.apiURL.dashboard_files);
    }
    getRequestsForDashboard(){
        return this.http.get(this.apiEndpoint + this.apiURL.dashboard_requests);
    }
}