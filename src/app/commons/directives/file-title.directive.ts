import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import * as _ from 'lodash';

@Directive({
  selector: '[fileTitle]',
  providers:[
    {
      provide: NG_VALIDATORS,
      useClass: FileTitleDirective,
      multi: true
    }
  ]
})
export class FileTitleDirective implements Validator{
  constructor() { }

  @Input() public fileRefNo: string = '';

  validate(control: AbstractControl<any, any>): ValidationErrors | null {
    let fieldValue = control.value;
    console.log("The file reference number is - "+this.fileRefNo)
    if(_.isEmpty(fieldValue))
      return {ftValid:false,showError:true,message:'File title is required'}
    else if(_.isEmpty(this.fileRefNo))
      return {ftValid:false,showError:true,message:'File title should be in the format of <<File Reference No - title>>'}
    else{
      if(fieldValue.indexOf("-") == -1)
        return {ftValid:false,showError:true,message:'File title should be in the format of <<File Reference No - title>>'}
      else if(fieldValue.split("-")[0] != this.fileRefNo)
        return {ftValid:false,showError:true,message:'File title should be in the format of <<File Reference No - title>>'}
      else if(fieldValue.split("-")[1].length == 0)
        return {ftValid:false,showError:true,message:'File title should be in the format of <<File Reference No - title>>'}
      else
      return null
    }
  }
}
