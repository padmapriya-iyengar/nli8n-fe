import { Component,OnInit } from '@angular/core';
import { UtilityService } from '../commons/utilities.service';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  constructor(private utilService: UtilityService, private confirmationService: ConfirmationService) { }
  userName: string="";
  password: string="";

  ngOnInit(): void {
    
  }

  loadDashboard(){
    if(this.utilService.isEmpty(this.userName) || this.utilService.isEmpty(this.password)){
      this.utilService.alert('error', 'Error', 'Please enter your username and password!!', false);
      return;
    }
    this.utilService.setUserActions(false);
    this.utilService.saveToStorage("IS_LOGGEDIN",true)
    this.utilService.pushRoute('dashboard');
  }
}
