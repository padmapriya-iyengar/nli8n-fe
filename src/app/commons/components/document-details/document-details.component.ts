import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UtilitiesService } from '../../services/utilities.service';
import * as _ from "lodash";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'document-details',
  templateUrl: './document-details.component.html',
  styleUrls: ['./document-details.component.scss']
})
export class DocumentDetailsComponent  implements OnInit, OnChanges {
  constructor(private utilService: UtilitiesService,
    private datePipe: DatePipe) { }
  @Input() fileDetails : any[] = [];
  @Input() existingFileDetails: any[] = [];
  @ViewChild('docDetails') reqForm!: NgForm;
  formSubmitted: boolean = false;
  documentDetails!: any;
  secClassification: any[] = [];
  documentType: any[] = [];
  todaysDate: Date = new Date();
  @Output() detSubmit = new EventEmitter<any>();
  @Input() detailsSubmit: boolean = false;
  allDocDetails: any[] = [];
  copyToAll: boolean = false;
  @Input() division!: string;
  isDuplicateExists: boolean = false;
  duplicateCount: number = 0;
  allFileNames: any[] = [];
  invalidDocuments: string = "";
  @Input() serviceType: string = "";
  showOutgoing: boolean = false;

  ngOnInit(): void {
    this.getSecurityClassifications();
    this.getDocumentTypes();
    this.loadDocumentDetails();
    this.existingFileDetails?.forEach(eFile => {
      this.allFileNames.push(eFile.FileName);
    })
    if(this.serviceType == 'Circulation')
      this.showOutgoing = true;
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['detailsSubmit'].currentValue) {
      this.submit()
    }
  }
  loadDocumentDetails(){
    this.fileDetails?.forEach(fDet =>{
      let detObj: any = {};
        detObj.fileName = fDet.name;
        detObj.mimeType = fDet.type;
        this.allFileNames.push(fDet.name);
        fDet.newName = fDet.name;
        let index = _.findIndex(this.existingFileDetails, function (file) { return file.FileName == fDet.name; })
        if(index != -1){
          fDet.class = 'version-file-card'
          fDet.isFileNameEdit = false;
          this.isDuplicateExists = true;
          this.duplicateCount++;
          detObj.documentId = this.existingFileDetails[index].ID;
        } else{
          fDet.class = 'file-card'
          fDet.isFileNameEdit = false;
          detObj.documentId = '';
        }
        let reader = new FileReader();
        reader.onload = (e: any) => {
          let TYPED_ARRAY = new Uint8Array(e.target.result);
          const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
            return data + String.fromCharCode(byte);
          }, '');
          let base64String = btoa(STRING_CHAR);
          detObj.base64String = base64String;
        };
        reader.readAsArrayBuffer(fDet);
      this.allDocDetails.push(detObj);
    })
    if(this.allDocDetails.length > 0){
      this.getFileDetails(0)
    }
  }
  getSecurityClassifications() {
    this.secClassification = [];
    //Service Integration
    let response = {"CodeTables":[{"CodeTables-id":{"Id":"389463","ItemId":"002248573547A1ECA03AED61BD366817.389463"},"DisplayOrder":"2","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"C","I_TB_ParentCode":null,"Code":"SCLASS_C","Name":"Confidential","Category":"SECURITY_CLASSIFICATION","Status":"A","CodeId":"3149","Title":{"Value":"CODE-000030364"}},{"CodeTables-id":{"Id":"389464","ItemId":"002248573547A1ECA03AED61BD366817.389464"},"DisplayOrder":"3","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"R","I_TB_ParentCode":null,"Code":"SCLASS_R","Name":"Restricted","Category":"SECURITY_CLASSIFICATION","Status":"A","CodeId":"3150","Title":{"Value":"CODE-000030365"}},{"CodeTables-id":{"Id":"389462","ItemId":"002248573547A1ECA03AED61BD366817.389462"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"S","I_TB_ParentCode":null,"Code":"SCLASS_S","Name":"Secret","Category":"SECURITY_CLASSIFICATION","Status":"A","CodeId":"3148","Title":{"Value":"CODE-000030363"}}]}
    this.getMasterDataSuccessHandler(response,'SECURITY_CLASSIFICATION')
  }
  getDocumentTypes(){
    this.documentType = [];
    //Service Integration
    let response = {"CodeTables":[{"CodeTables-id":{"Id":"389463","ItemId":"002248573547A1ECA03AED61BD366817.389463"},"DisplayOrder":"2","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"C","I_TB_ParentCode":null,"Code":"SCLASS_C","Name":"Confidential","Category":"SECURITY_CLASSIFICATION","Status":"A","CodeId":"3149","Title":{"Value":"CODE-000030364"}},{"CodeTables-id":{"Id":"389464","ItemId":"002248573547A1ECA03AED61BD366817.389464"},"DisplayOrder":"3","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"R","I_TB_ParentCode":null,"Code":"SCLASS_R","Name":"Restricted","Category":"SECURITY_CLASSIFICATION","Status":"A","CodeId":"3150","Title":{"Value":"CODE-000030365"}},{"CodeTables-id":{"Id":"389462","ItemId":"002248573547A1ECA03AED61BD366817.389462"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"S","I_TB_ParentCode":null,"Code":"SCLASS_S","Name":"Secret","Category":"SECURITY_CLASSIFICATION","Status":"A","CodeId":"3148","Title":{"Value":"CODE-000030363"}}]}
    this.getMasterDataSuccessHandler(response,'DOCUMENT_TYPES')
  }
  getMasterDataSuccessHandler(response: any, type: any) {
    if (response.CodeTables){
      if (response.CodeTables.length > 0){
        if (type == 'SECURITY_CLASSIFICATION') {
          response.CodeTables.forEach((data: any) => {
            this.secClassification.push({ label: data.Name, value: data.Code })
          })
          this.documentDetails? this.documentDetails.securityClassification = 'SCLASS_S' : ''
        }
      } else if(!response.CodeTables.length){
        let data = response.CodeTables;
        if (type == 'SECURITY_CLASSIFICATION') {
          this.secClassification.push({ label: data.Name, value: data.Code })
          this.documentDetails.securityClassification = 'SCLASS_S'
        }
      }
    }
    if (response.DocumentTypes){
      if (response.DocumentTypes.length > 0) {
        if (type == 'DOCUMENT_TYPES') {
          response.DocumentTypes.forEach((data: any) => {
            this.documentType.push({ label: data.DocumentType, value: data.CodeId })
          })
        }
      } else if (!response.DocumentTypes.length) {
        let data = response.DocumentTypes;
        if (type == 'DOCUMENT_TYPES') {
          this.documentType.push({ label: data.DocumentType, value: data.CodeId })
        }
      }
    }
  }
  submit(){
    this.formSubmitted = true;
    if (!this.isDocDetailValid()) {
      this.detSubmit.emit({ status: 'FAILURE', details: null });
      this.utilService.alert('error', 'Error', 'Please fill the mandatory details for the files - ' + this.invalidDocuments, false);
    } else if(this.allDocDetails.length == 0){
      this.formSubmitted = false;
      this.detSubmit.emit({ status: 'FAILURE', details: null });
      this.utilService.alert('error', 'Error', 'Please click on cancel to go back to document upload!!', false);
    } else {
      this.detSubmit.emit({ status: 'SUCCESS', details: this.allDocDetails });
    }
  }
  getFileDetails(index: number){
    this.documentDetails = this.allDocDetails[index];
    setTimeout(() => {
      this.handleStyle(index);
    });
  }
  isDocDetailValid(): boolean{
    let isValid: boolean = true;
    this.invalidDocuments = "";
    this.allDocDetails.forEach((doc:any) => {
      if (this.utilService.isEmpty(doc.securityClassification) || this.utilService.isEmpty(doc.docType)){
        isValid = false;
        this.invalidDocuments += doc.fileName+','
      }
    })
    if(this.invalidDocuments.substring(this.invalidDocuments.length-1,this.invalidDocuments.length) == ",")
      this.invalidDocuments = this.invalidDocuments.substring(0, this.invalidDocuments.length-1)
    return isValid;
  }
  handleStyle(index: number){
    let element = null;
    for(var i=0;i<this.fileDetails.length;i++){
      if(i==index){
        element = document.getElementById('fileCard_' + index);
        if (element != null && _.includes(this.fileDetails[i].class, 'version-file-card')){
          element.classList.add('version-file-card-highlight')
        } else if (element != null && _.includes(this.fileDetails[i].class, 'version-change-file-card')) {
          element.classList.add('version-change-file-card-highlight')
        } else if (element != null && _.includes(this.fileDetails[i].class, 'name-change-file-card')) {
          element.classList.add('name-change-file-card-highlight')
        } else if(element != null && !_.includes(this.fileDetails[i].class, 'version-file-card')
          && !_.includes(this.fileDetails[i].class, 'version-change-file-card')
          && !_.includes(this.fileDetails[i].class, 'name-change-file-card')) {
          element.classList.add('file-card-highlight')
        }
      } else{
        element = document.getElementById('fileCard_' + i);
        if (element != null && _.includes(this.fileDetails[i].class, 'version-file-card')) {
          element.classList.remove('version-file-card-highlight')
        } else if (element != null && _.includes(this.fileDetails[i].class, 'version-change-file-card')) {
          element.classList.remove('version-change-file-card-highlight')
        } else if (element != null && _.includes(this.fileDetails[i].class, 'name-change-file-card')) {
          element.classList.remove('name-change-file-card-highlight')
        } else if (element != null && !_.includes(this.fileDetails[i].class, 'version-file-card')
          && !_.includes(this.fileDetails[i].class, 'version-change-file-card')
          && !_.includes(this.fileDetails[i].class, 'name-change-file-card')) {
          element.classList.remove('file-card-highlight')
        }
      }
    }
  }
  copyFileDetails(data: any){
    if(data){
      let copyContent = this.allDocDetails[0];
      if (this.utilService.isEmpty(copyContent.securityClassification) || this.utilService.isEmpty(copyContent.docType)) {
        this.formSubmitted = true;
        this.utilService.alert('error', 'Error', 'To copy details, please fill mandatory information for the first document - ' + this.fileDetails[0].name, false);
        setTimeout(() => {
          this.copyToAll = false;
        }); 
      } else {
        this.allDocDetails.forEach(doc => {
          doc.securityClassification = copyContent.securityClassification;
          doc.docType = copyContent.docType;
          doc.docDate = copyContent.docDate;
          doc.docDescription = copyContent.docDescription;
          doc.docRemarks = copyContent.docRemarks;
          doc.isOutgoing = copyContent.isOutgoing;
        })
      }
    }
  }
  deleteDocument(index: number){
    if (_.includes(this.fileDetails[index].class, 'version-file-card'))
      this.duplicateCount--;
    if(this.duplicateCount == 0)
      this.isDuplicateExists = false;
    this.fileDetails.splice(index, 1)
    this.allDocDetails.splice(index, 1)
  }
  versionDocument(index: number){
    this.duplicateCount --;
    if(this.duplicateCount == 0)
      this.isDuplicateExists = false;
    this.fileDetails[index].documentId = this.allDocDetails[index].documentId;
    this.fileDetails[index].class = 'version-change-file-card';
    this.reloadAllDocs(index);
  }
  enableRenameDocument(index: number){
    this.fileDetails[index].isFileNameEdit= true;
  }
  renameDocument(index: number){
    let HTMLElement:any = document.getElementById('fileName_'+index);
    var newFileName: any = HTMLElement ? HTMLElement.value : '';
    if(_.indexOf(this.allFileNames,newFileName) == -1){
      this.duplicateCount--;
      if (this.duplicateCount == 0)
        this.isDuplicateExists = false;
      this.fileDetails[index].newName = newFileName;
      this.fileDetails[index].class = 'name-change-file-card';
      this.fileDetails[index].isFileNameEdit = false;
      this.reloadAllDocs(index);
    } else{
      this.utilService.alert('error', 'Error', 'Please change the name as file name already exists', false);
    }
  }
  reloadAllDocs(index: number){
    this.allDocDetails[index].documentId = this.fileDetails[index].documentId,
    this.allDocDetails[index].fileName = this.fileDetails[index].newName
  }
  onMndtFieldChange(data: any, attribute: any){
    let index = _.findIndex(this.allDocDetails, function (doc) { return doc[attribute] != data.value; })
    if (index != -1) {
      this.copyToAll = false;
    } else {
      this.copyToAll = true;
    }
  }
  onNonMndtFieldChange(data: any, attribute: any) {
    let index = _.findIndex(this.allDocDetails, function (doc) { return doc[attribute] != data; })
    if (index != -1) {
      this.copyToAll = false;
    } else {
      this.copyToAll = true;
    }
  }
  onDateFieldChange(data: any, attribute: any) {
    let context:any = this;
    let index = _.findIndex(this.allDocDetails, function (doc) { return context.datePipe.transform(doc[attribute], "yyyy-MM-dd'T'hh:mm") != context.datePipe.transform(data, "yyyy-MM-dd'T'hh:mm"); })
    if (index != -1) {
      this.copyToAll = false;
    } else {
      this.copyToAll = true;
    }
  }
  onCheckboxChange(data: any, attribute: any) {
    let index = _.findIndex(this.allDocDetails, function (doc) { return doc[attribute] != data.checked; })
    if (index != -1) {
      this.copyToAll = false;
    } else {
      this.copyToAll = true;
    }
  }
}
