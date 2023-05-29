import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { api } from "src/config/api-url";

@Injectable()
export class AppService {
    constructor(private http: HttpClient) { }
    apiURL:any = api;
    getMasterDataByType(type:string) {
        return this.http.get(this.apiURL.get_master_data+'?source=type&identifier='+type);
    }
    getMasterDataByTypeAndParent(type:string,parent_code:string) {
        return this.http.get(this.apiURL.get_master_data+'?source=type_parent&identifier='+type+'&parent_code='+parent_code);
    }
    getMasterDataByCode(code:string) {
        return this.http.get(this.apiURL.get_master_data+'?source=code&identifier='+code);
    }
    getUserNotifications(username:string){
        return this.http.get(this.apiURL.user_notifications+'?username='+username);
    }
    updateUserNotifications(id:string,action:string){
        return this.http.post(this.apiURL.user_notifications+'?id='+id,{action: action});
    }
    getUserDivisions(username:string){
        return this.http.get(this.apiURL.user_divisions+'?username='+username);
    }
    getUsers(){
        return this.http.get(this.apiURL.users);
    }
    getUserProfile(username:string){
        return this.http.get(this.apiURL.user_profile+'?username='+username);
    }
    getUserInfo(username:string){
        return this.http.get(this.apiURL.user_details+'?username='+username);
    }
    getSequence(type:string){
        return this.http.get(this.apiURL.sequence+'?type='+type);
    }
    generateSequence(type:string){
        return this.http.post(this.apiURL.sequence+'?type='+type,{});
    }
}