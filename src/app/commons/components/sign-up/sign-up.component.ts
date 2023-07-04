import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UtilitiesService } from '../../services/utilities.service';
import { Router } from '@angular/router';
import { AgcService } from '../../services/agc.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit{

  constructor(private utilService: UtilitiesService, private agcService: AgcService,private router: Router){}

  @ViewChild('signupForm') signupForm!: NgForm;
  showSpinner: boolean = false;
  formSubmitted: boolean = false;
  readOnly: boolean = false;
  userObj: any = {}
  plainPassword: string = ""
  password: string = ""
  pwdsMatch: boolean = false
  isUNameValid: boolean = false;
  departments:any[] = [];
  divisions:any[]=[];

  ngOnInit(): void {
    this.loadDepartments()
    this.loadDivisions()
  }
  loadDivisions(){
    this.divisions=[];
    this.showSpinner = true;
    this.agcService.getMasterDataByType('FILE_DIVISION').subscribe({next: (response) => {
        let resp = Object.assign(response)
        if(resp){
          if(resp.length){
            resp.forEach((item:any) => {
              this.divisions.push({ label: item.value, value: item.code })
            })
          }
          this.showSpinner = false;
        }
      },
      error: (error) => {
        console.error('Request failed with error')
        this.showSpinner = false;
      }
    })
  }
  loadDepartments(){
    this.departments = [];
    this.showSpinner = true;
    this.agcService.getMasterDataByType('DEPARTMENT').subscribe({next: (response) => {
        let resp = Object.assign(response)
        if(resp){
          if(resp.length){
            resp.forEach((item:any) => {
              this.departments.push({ label: item.value, value: item.code })
            })
          }
          this.showSpinner = false;
        }
      },
      error: (error) => {
        console.error('Request failed with error')
        this.showSpinner = false;
      }
    })
  }
  comparePassword(){
    if(!this.utilService.isEmpty(this.password) && !this.utilService.isEmpty(this.plainPassword)){
      if(this.password != this.plainPassword){
        this.pwdsMatch = false;
        this.utilService.alert('error','Password Mismatch','Please confirm the right password!',false)
      } else{
        this.pwdsMatch = true;
      }
    }
  }
  checkUsername(){
    this.showSpinner = true;
      this.agcService.getUserInfo(this.userObj.username).subscribe({next: (response) => {
        let resp = Object.assign(response)
        if(resp){
          if(resp.length > 0){
            this.isUNameValid = false;
            this.utilService.alert('error','Username exists','Username already exists!',false)
            this.userObj.username = '';
          } else{
            this.isUNameValid = true;
          }
        }
      },
      error: (error) => {
        console.log('Request failed with error');
        this.showSpinner = false;
      }
    })
  }
  signUp(){
    this.formSubmitted = true;
    if(!this.signupForm.valid){
      this.utilService.alert('error','Missing Information','Please fill in the mandatory details!',false)
    } else if(!this.isUNameValid){
      this.utilService.alert('error','Username exists','Username already exists!',false)
    } else if(!this.pwdsMatch){
      this.utilService.alert('error','Password Mismatch','Please confirm the right password!',false)
    } else{
      this.showSpinner = true
        this.agcService.generateHash(this.plainPassword, '10').subscribe({next: (response) => {
          let resp = Object.assign(response)
          if(resp){
            this.userObj.password = resp.valueOf();
              this.agcService.createUser(this.userObj).subscribe({next: (createUserResponse) => {
                let createUserResp = Object.assign(createUserResponse)
                if(createUserResp){
                  this.utilService.alert('success','Success',createUserResp.message, false)
                  this.showSpinner = false;
                  this.router.navigate(['./login'])
                }
              },
              error: (error) => {
                console.log('Request failed with error');
                this.showSpinner = false;
              }
            })
          }
        },
        error: (error) => {
          console.log('Request failed with error');
          this.showSpinner = false;
        }
      })
    }
  }
}
