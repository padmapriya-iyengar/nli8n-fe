import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { SIWMigrationService } from '../commons/migration.service';
import { UtilityService } from '../commons/utilities.service';

@Component({
  selector: 'migration-data-upload',
  templateUrl: './migration-data-upload.component.html',
  styleUrls: ['./migration-data-upload.component.scss']
})
export class MigrationDataUploadComponent implements OnInit {
  constructor(private utilService: UtilityService, private datePipe: DatePipe,
    private confirmationService: ConfirmationService,
    private migService: SIWMigrationService) { }

  entityNames: any[] = [];
  dataEntityName: string = "";
  updateRecords: string = 'Yes';
  ignoreDuplicates: boolean = false;
  uploadType: string = 'SharedLocation';
  sharedLocation: string = "";
  uploadedFiles: any[] = [];
  dataFiles: any[] = [];
  docDataCols: any[] = [];
  @ViewChild('documentsData') documentsData!: Table;
  uplType: string = 'SharedLocation';
  updBtnName = 'Ingest'
  updValBtnName = 'Ingest & Validate'
  selectedDocs: any[] = [];

  ngOnInit(): void {
    this.utilService.clearBreadcrumb();
    this.getSharedFilePath();
    this.loadEntities();
    this.docDataCols = [
      { field: "FileName", label: "Name", type: "string" },
      { field: "FileDate", label: "Document Date", type: "date" }
    ];
  }
  loadEntities() {
    this.migService.getMigrationEntities(this.getEntitiesSuccessHandler, this.errorHandler, this);
  }
  getEntitiesSuccessHandler(data: any, prms: any) {
    if(!data.entity.length){
      prms.entityNames.push({ label: data.entity.entityDescription, value: _.toUpper(data.entity.entityName) })
    } else if (data.entity.length > 0){
      data.entity.forEach((ent: any) => {
        prms.entityNames.push({ label: ent.entityDescription, value: _.toUpper(ent.entityName) })
      })
    }
  }
  getDocumentsFromSharedPath(){
    if (this.utilService.isEmpty(this.sharedLocation)){
      this.utilService.alert('error', 'Error', 'Please enter a shared path to retrieve documents!!', false);
    } else if (this.utilService.isEmpty(this.dataEntityName)) {
      this.utilService.alert('error', 'Error', 'Please select an entity!!', false);
    } else{
      this.migService.getSharedFiles(this.dataEntityName, this.sharedLocation, this.getSharedFileSuccessHandler, this.errorHandler, this)
    }
  }
  getSharedFileSuccessHandler(data: any, prms: any) {
    prms.dataFiles = [];
    if (data.FILE_DETAILS){
      if (!data.FILE_DETAILS.length){
        prms.dataFiles.push(data.FILE_DETAILS)
      } else if (data.FILE_DETAILS.length > 0){
        data.FILE_DETAILS.forEach((file: any) => {
          prms.dataFiles.push(file);
        })
      }
    } else{
      prms.utilService.alert('error', 'Error', 'No files found for the selected entity in the location!!', false);
    }
    prms.documentsData.reset();
  }
  getSharedFilePath(){
    this.migService.getSharedFilePath(this.sharedFilePathSuccessHandler, this.errorHandler, this)
  }
  sharedFilePathSuccessHandler(data: any, prms: any) {
    if (data) {
      prms.sharedLocation = data.Value;
    }
  }
  serviceErrorHandler(response: any, status: any, errorText: any, prms: any) {
    prms.curComp.utilService.alert('error', 'Error', 'Service error, please contact administrator!!', false);
  }
  errorHandler(response: any, prms: any) {
    prms.utilService.alert('error', 'Error', 'Service error, please contact administrator!!', false);
  }
  onSelect(docData: any){
    let aFiles: any[] = [];
    let rFiles: any[] = [];
    this.dataFiles = [];
    aFiles.push(...docData.addedFiles)
    rFiles.push(...docData.rejectedFiles)
    if (rFiles.length > 0) {
      let fNames: string = '';
      rFiles.forEach(fl => {
        fNames += fl.name + ","
      })
      fNames = fNames.substring(0, fNames.length - 1)
      this.utilService.alert('error', 'Unsupported file format', 'Cannot upload files - ' + fNames + '. Please upload xml files only!!', false);
    }
    if (aFiles.length > 0) {
      aFiles.forEach((fl:any)=>{
        fl.updatedName = fl.name.substring(0, _.lastIndexOf(fl.name, '.')) + "_" + Date.now() + fl.name.substring(_.lastIndexOf(fl.name, '.'), fl.name.length);
        this.uploadedFiles.push(fl);
      })
    }
    if(!this.utilService.isEmpty(this.dataEntityName)){
      if (this.uploadedFiles.length > 0) {
        this.uploadedFiles.forEach((file: any) => {
          let doc: any = {
            FileName: file.updatedName,
            FileDate: this.datePipe.transform(file.lastModifiedDate, "yyyy-MM-dd'T'hh:mm:ss"),
            FileSize: file.size,
            FileType: file.type,
          }
          let reader = new FileReader();
          reader.onload = (e: any) => {
            let TYPED_ARRAY = new Uint8Array(e.target.result);
            const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
              return data + String.fromCharCode(byte);
            }, '');
            let base64String = btoa(STRING_CHAR);
            doc.Base64String = base64String;
          };
          reader.readAsArrayBuffer(file);
          this.dataFiles.push(doc);
        })
      }
    } else{
      this.dataFiles = [];
      this.uploadedFiles = [];
      aFiles = [];
      rFiles = [];
      this.utilService.alert('error', 'Error', 'Please select an entity!!', false);
    }
  }
  deleteDocument(){
    if (this.selectedDocs.length > 0){
      this.selectedDocs.forEach((document:any) => {
        let docIndex = _.findIndex(this.dataFiles, function (doc) { return doc.FileName == document.File.FileName; })
        if (docIndex != -1) {
          this.dataFiles.splice(docIndex, 1);
          this.uploadedFiles.splice(docIndex, 1);
        }
      })
      this.selectedDocs = [];
    } else{
      this.utilService.alert('error', 'Error', 'Please select document(s) to delete!!', false);
    }
  }
  onDocumentSelected(selectedDoc: any) {
    if (this.uplType == 'SharedLocation') {
      let doc: any = {
        FileName: selectedDoc.data.FileName,
        FilePath: selectedDoc.data.FilePath,
        FileType: selectedDoc.data.FileType
      }
      this.selectedDocs.push({ File: doc });
    } else{
      let doc: any = {
        FileName: selectedDoc.data.FileName,
        FilePath: this.sharedLocation + "\\" + this.dataEntityName,
        FileContent: selectedDoc.data.Base64String,
        FileType: 'XML'
      }
      this.selectedDocs.push({ File: doc });
    }
  }
  onDocumentUnselected(unselectedDoc: any) {
    let docIndex = _.findIndex(this.selectedDocs, function (doc) { return doc.File.FileName == unselectedDoc.data.FileName; })
    if(docIndex != -1){
      this.selectedDocs.splice(docIndex, 1);
    }
  }
  uploadData(){
    if(this.uplType == 'SharedLocation'){
      if(this.selectedDocs.length > 0){
        let entName = this.dataEntityName
        let entityDescription = this.entityNames[_.findIndex(this.entityNames, function (ent) { return ent.value == entName; })].label
        let req = {
          EntityName: entName,
          IgnoreDuplicate: this.updateRecords == 'Yes' ? 'No' : 'Yes',
          EntityDescription: entityDescription,
          Files: this.selectedDocs
        }
      } else{
        this.utilService.alert("error","Error","Please select document(s) to ingest!!", false);
      }
    } else{
      if (this.selectedDocs.length > 0) {
        let entName = this.dataEntityName
        let entityDescription = this.entityNames[_.findIndex(this.entityNames, function (ent) { return ent.value == entName; })].label
        let req = {
          EntityName: entName,
          IgnoreDuplicate: this.updateRecords == 'Yes' ? 'No' : 'Yes',
          EntityDescription: entityDescription,
          Files: this.selectedDocs
        }
      } else {
        this.utilService.alert("error", "Error", "Please select document(s) to upload!!", false);
      }
    }
  }
  uploadFileSuccessHandler(data: any, prms: any) {
    prms.utilService.alert("success", "Success", "Ingestion initiated, please check data ingestion report for updates!!");
    prms.dataEntityName = "";
    prms.selectedDocs = [];
    prms.uploadedFiles = [];
    prms.dataFiles = [];
  }
  uploadSharedFileSuccessHandler(data: any, prms: any) {
    if (data) {
      if (data.text == 'Success'){
        prms.utilService.alert("success", "Success","Ingestion initiated, please check data ingestion report for updates!!");
        prms.dataEntityName = "";
        prms.selectedDocs = [];
        prms.uploadedFiles = [];
        prms.dataFiles = [];
      }
    }
  }
  onUploadTypeChange(){
    if(this.dataFiles.length > 0){
      this.confirmationService.confirm({
        message: 'Changing the upload type will clear the existing documents.Do you want to proceed?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.uploadedFiles = [];
          this.dataFiles = [];
          this.uplType = this.uploadType
          this.documentsData.reset();
        },
        reject: () => {
          this.uploadType = this.uplType;
        }
      });
      if (this.uplType == 'SharedLocation') {
        this.updBtnName = 'Ingest'
        this.updValBtnName = 'Ingest & Validate'
      } else {
        this.updBtnName = 'Upload & Ingest'
        this.updValBtnName = 'Upload & Validate'
      }
    } else{
      this.uploadedFiles = [];
      this.dataFiles = [];
      this.uplType = this.uploadType
      if (this.uplType == 'SharedLocation'){
        this.updBtnName = 'Ingest'
        this.updValBtnName = 'Ingest & Validate'
      } else{
        this.updBtnName = 'Upload & Ingest'
        this.updValBtnName = 'Upload & Validate'
      }
      this.documentsData.reset();
    }
  }
}