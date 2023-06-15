import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Table } from 'primeng/table';
import { SIWMigrationService } from '../../commons/services/migration.service';
import { UtilityService } from '../../commons/services/utilities.service';

@Component({
  selector: 'file-report',
  templateUrl: './file-report.component.html',
  styleUrls: ['./file-report.component.scss']
})
export class FileReportComponent implements OnInit {
  constructor(private utilService: UtilityService, private modalService: BsModalService,
    private migService: SIWMigrationService) { }

  @Input() fileDetails!: any;
  @Input() source!: any;
  dataEntityName: string = "TB_FILEREFNOFORMAT";
  entityNames: any[] =[];
  fileName: string = "";
  usersList: any[] = [];
  uploadedBy: string = "";
  fileStatus: string = "";
  fileCount: any = {};
  showTotalRecords: boolean = true;
  showUploadSuccessRecords: boolean = false;
  showUploadFailureRecords: boolean = false;
  showValidateSuccessRecords: boolean = false;
  showValidateFailureRecords: boolean = false;
  showMigrateSuccessRecords: boolean = false;
  showMigrateFailureRecords: boolean = false;
  dataRecords: any[] = [];
  dataRecordCols: any[] = [];
  tableHeading: string = "File Report - Total";
  selectedIndex: number = -1;
  isCollapsed: boolean = false;
  tableRowCount: number = 8
  modalRef!: BsModalRef;
  isReqSubmitted!: boolean;
  rowDetails: any = {};
  @ViewChild('migrationData') migrationData!: Table;
  rowModalHeader: string = "";
  filteredRecords: any[] = [];
  currentPageNumber: number = 1;
  isBackDisabled: boolean = true;
  isFrontDisabled: boolean = true;
  totalRecordCount: number = 0;
  filteredRecordCount: number = 0;
  filterType: string = "";
  showSpinner: boolean = false;

  ngOnInit(): void {
    if(this.fileDetails){
      this.fileName = this.fileDetails.fileData.FILE_NAME;
      this.fileStatus = this.fileDetails.fileData.FILE_STATUS;
    }
    this.loadEntities();
    this.loadUsersList();
    this.dataRecordCols = [
      { field: "DataRow", label: "Data Row", type: "string" },
      { field: "DMIngestionStatus", label: "Upload Status", type: "string" },
      { field: "DMIngestionMessage", label: "Upload Message", type: "string" },
      { field: "DMValidationStatus", label: "Validation Status", type: "string" },
      { field: "DMValidationMessage", label: "Validation Message", type: "string" },
      { field: "DMMigrationStatus", label: "Migration Status", type: "string" },
      { field: "DMMigrationMessage", label: "Migration Message", type: "string" }
    ];
    this.utilService.pageNo.subscribe(page => {
      if (page.cPage == 1){
        this.isBackDisabled = true;
        this.isFrontDisabled = false;
      }
      if (page.cPage == Math.ceil(this.totalRecordCount / this.tableRowCount)){
        this.isFrontDisabled = true;
        this.isBackDisabled = false;
      }
      if ((this.totalRecordCount < this.tableRowCount) || (this.totalRecordCount == this.tableRowCount)){
        this.isBackDisabled = true;
        this.isFrontDisabled = true;
      }
      if (page.cPage != 1 && page.cPage != Math.ceil(this.totalRecordCount / this.tableRowCount) && 
        this.totalRecordCount > this.tableRowCount){
        this.isBackDisabled = false;
        this.isFrontDisabled = false;
      }
    })
  }
  loadEntities() {
    this.migService.getMigrationEntities(this.getEntitiesSuccessHandler, this.errorHandler, this);
  }
  getEntitiesSuccessHandler(data: any, prms: any) {
    if (!data.entity.length) {
      prms.entityNames.push({ label: data.entity.entityDescription, value: _.toUpper(data.entity.entityName) })
    } else if (data.entity.length > 0) {
      data.entity.forEach((ent: any) => {
        prms.entityNames.push({ label: ent.entityDescription, value: _.toUpper(ent.entityName) })
      })
    }
    //prms.dataEntityName = _.toUpper(prms.fileDetails.fileData.ENTITY)
    prms.resetPage();
  }
  loadUsersList() {
    this.migService.getMigrationAdminUsers(this.getMigrationAdminUsersSuccessHandler, this.errorHandler, this);
  }
  getMigrationAdminUsersSuccessHandler(data: any, prms: any) {
    prms.usersList = [];
    if (data.USER_DETAILS){
      if (!data.USER_DETAILS.length) {
        prms.usersList.push({ label: data.USER_DETAILS.USER_NAME, value: data.USER_DETAILS.USER_ID })
      } else if (data.USER_DETAILS.length > 0) {
        data.USER_DETAILS.forEach((user: any) => {
          prms.usersList.push({ label: user.USER_NAME, value: user.USER_ID })
        })
      }
      prms.uploadedBy = prms.fileDetails.fileData.UPLOADED_BY
    }
  }
  filterReport(type: string, domId: string){
    this.resetTableVisibility();
    this.dataRecordCols = [];
    this.filteredRecords = [];
    if(!this.utilService.isEmpty(domId)){
      this.resetTagStyles();
      let domObj: any = document.getElementById(domId)
      domObj?.classList.remove('custom-report-tag')
      domObj?.classList.add("custom-report-tag-selected");
    }
    this.refreshData(0,type);
  }
  resetTableVisibility(){
    this.showTotalRecords = false;
    this.showUploadSuccessRecords = false;
    this.showUploadFailureRecords = false;
    this.showValidateSuccessRecords = false;
    this.showValidateFailureRecords = false;
    this.showMigrateSuccessRecords = false;
    this.showMigrateFailureRecords = false;
  }
  onRowSelected(selectedDoc: any) {
    this.selectedIndex = selectedDoc.index;
  }
  onRowUnselected(unselectedDoc: any) {
    this.selectedIndex = -1
  }
  refreshData(position:any, filter:any){
    this.dataRecords = [];
    this.dataEntityName = "TB_FILEREFNOFORMAT";
    this.getReport(position, filter);
  }
  getReport(position:any, filter:any) {
    this.showSpinner = true;
    this.filterType = filter;
    this.setTableInfo();
    let req = {
      cursor: {},
      entityName: this.dataEntityName,
      jobFileId: this.fileDetails.fileData.JOB_FILES_ID,
      dmStatus: filter == 'UPLOAD_SUCCESS' ? 'Ingested' : filter == 'VALIDATE_SUCCESS' ? 'Validated' : 
        filter == 'VALIDATE_FAILURE' ? 'Validation Failed' : filter == 'MIGRATE_SUCCESS' ? 'Migrated' : 
          filter == 'MIGRATE_FAILURE' ? 'Migration Failed' : ''
    }
    this.migService.readMigrationDataForFileId(position,this.tableRowCount,req, this.migrationFileDataSuccessHandler, this.errorHandler, this)
  }
  migrationFileDataSuccessHandler(data: any, prms: any) {
    if (data.response) {
      if (data.response.data){
        let resp = data.response.data;
        prms.dataRecords = [];
        prms.filteredRecords = [];
        if(!resp.tuple.length){
          resp.tuple.old[prms.dataEntityName]['DataRow'] = 'Element ' + resp.tuple.old[prms.dataEntityName]['DMFileId']
          prms.dataRecords.push(resp.tuple.old[prms.dataEntityName])
        } else if(resp.tuple.length > 0){
          resp.tuple.forEach((tp: any)=>{
            tp.old[prms.dataEntityName]['DataRow'] = 'Element ' + tp.old[prms.dataEntityName]['DMFileId']
            prms.dataRecords.push(tp.old[prms.dataEntityName])
          })
        }
        prms.filteredRecords = _.cloneDeep(prms.dataRecords)
        if (prms.migrationData)
          prms.migrationData.reset();
      }
      if (data.response.file) {
        prms.getRecordCountInfo(data.response.file);
      }
    }
  }
  setTableInfo(){
    this.dataRecordCols = [];
    if (this.filterType == 'TOTAL') {
      this.showTotalRecords = true;
      this.tableHeading = "File Report - Total";
      this.dataRecordCols = [
        { field: "DataRow", label: "Data Row", type: "string" },
        { field: "DMIngestionStatus", label: "Upload Status", type: "string" },
        { field: "DMIngestionMessage", label: "Upload Message", type: "string" },
        { field: "DMValidationStatus", label: "Validation Status", type: "string" },
        { field: "DMValidationMessage", label: "Validation Message", type: "string" },
        { field: "DMMigrationStatus", label: "Migration Status", type: "string" },
        { field: "DMMigrationMessage", label: "Migration Message", type: "string" },
        { field: "DMStatus", label: "Row Status", type: "string" }
      ];
    } else if (this.filterType == 'UPLOAD_SUCCESS' || this.filterType == 'UPLOAD_FAILURE') {
      if (this.filterType == 'UPLOAD_SUCCESS') {
        this.showUploadSuccessRecords = true;
        this.tableHeading = "File Report - Upload Success";
      }
      else if (this.filterType == 'UPLOAD_FAILURE') {
        this.showUploadFailureRecords = true;
        this.tableHeading = "File Report - Upload Failed";
      }
      this.dataRecordCols = [
        { field: "DataRow", label: "Data Row", type: "string" },
        { field: "DMIngestionMessage", label: "Upload Message", type: "string" },
        { field: "DMIngestionStatus", label: "Upload Status", type: "string" },
        { field: "DMStatus", label: "Row Status", type: "string" }
      ];
    } else if (this.filterType == 'VALIDATE_SUCCESS' || this.filterType == 'VALIDATE_FAILURE') {
      if (this.filterType == 'VALIDATE_SUCCESS') {
        this.showValidateSuccessRecords = true;
        this.tableHeading = "File Report - Validation Success";
      }
      else if (this.filterType == 'VALIDATE_FAILURE') {
        this.showValidateFailureRecords = true;
        this.tableHeading = "File Report - Validation Failed";
      }
      this.dataRecordCols = [
        { field: "DataRow", label: "Data Row", type: "string" },
        { field: "DMValidationType", label: "Validation Type", type: "string" },
        { field: "DMValidationStatus", label: "Validation Status", type: "string" },
        { field: "DMValidationMessage", label: "Validation Message", type: "string" },
        { field: "DMStatus", label: "Row Status", type: "string" }
      ];
    } else if (this.filterType == 'MIGRATE_SUCCESS' || this.filterType == 'MIGRATE_FAILURE') {
      if (this.filterType == 'MIGRATE_SUCCESS') {
        this.showMigrateSuccessRecords = true;
        this.tableHeading = "File Report - Migration Success";
      }
      else if (this.filterType == 'MIGRATE_FAILURE') {
        this.showMigrateFailureRecords = true;
        this.tableHeading = "File Report - Migration Failed";
      }
      this.dataRecordCols = [
        { field: "DataRow", label: "Data Row", type: "string" },
        { field: "DMMigrationMessage", label: "Migration Message", type: "string" },
        { field: "DMMigrationStatus", label: "Migration Status", type: "string" },
        { field: "DMStatus", label: "Row Status", type: "string" }
      ];
    }
  }
  getRecordCountInfo(fileObj: any) {
    this.totalRecordCount = fileObj.TOTAL_COUNT;
    this.fileCount.total = fileObj.TOTAL_COUNT;
    this.fileCount.uploadSuccess = fileObj.UPLOAD_SUCCESS_COUNT;
    this.fileCount.uploadFailure = fileObj.UPLOAD_ERROR_COUNT;
    this.fileCount.validateSuccess = fileObj.VALIDATE_SUCCESS_COUNT;
    this.fileCount.validateFailure = fileObj.VALIDATE_ERROR_COUNT;
    this.fileCount.migrateSuccess = fileObj.MIGRATE_SUCCESS_COUNT;
    this.fileCount.migrateFailure = fileObj.MIGRATE_ERROR_COUNT;
    this.filteredRecordCount = this.filterType == 'UPLOAD_SUCCESS' ? fileObj.UPLOAD_SUCCESS_COUNT :
      this.filterType == 'UPLOAD_FAILURE' ? fileObj.UPLOAD_ERROR_COUNT : this.filterType == 'VALIDATE_SUCCESS' ? fileObj.VALIDATE_SUCCESS_COUNT : 
      this.filterType == 'VALIDATE_FAILURE' ? fileObj.VALIDATE_ERROR_COUNT : this.filterType == 'MIGRATE_SUCCESS' ? fileObj.MIGRATE_SUCCESS_COUNT : 
      this.filterType == 'MIGRATE_FAILURE' ? fileObj.MIGRATE_ERROR_COUNT : fileObj.TOTAL_COUNT;
    this.utilService.changeCurrentPageNumber(this.currentPageNumber);
    this.showSpinner = false
  }
  deleteEntry() {
    if (this.selectedIndex != -1) {
      let req = {
        entityName: this.fileDetails.fileData.ENTITY,
        jobFileId: this.fileDetails.fileData.JOB_FILES_ID,
        tableId: this.dataRecords[this.selectedIndex]['TableId']
      }
    } else {
      this.utilService.alert('error', 'Error', 'Please select an entry to delete!!', false);
    }
  }
  migrateEntry() {
    if (this.selectedIndex != -1) {
      let req = {
        EntityName: this.fileDetails.fileData.ENTITY,
        JobFileId: this.fileDetails.fileData.JOB_FILES_ID,
        TableId: this.dataRecords[this.selectedIndex]['TableId']
      }
    } else {
      this.utilService.alert('error', 'Error', 'Please select an entry to migrate!!', false);
    }
  }
  migrateDataSuccessHandler(data: any, prms: any) {
    if (data) {
      prms.utilService.alert("success", "Success", "Migration initiated, please refresh for updates!!");
      prms.refreshData();
    }
  }
  validateEntry() {
    if (this.selectedIndex != -1) {
      let req = {
        entityName: this.fileDetails.fileData.ENTITY,
        jobFileId: this.fileDetails.fileData.JOB_FILES_ID,
        tableId: this.dataRecords[this.selectedIndex]['TableId']
      }
    } else {
      this.utilService.alert('error', 'Error', 'Please select an entry to validate!!', false);
    }
  }
  validateDataSuccessHandler(data: any, prms: any) {
    if (data){
      prms.utilService.alert("success", "Success", "Validation initiated, please check data validation report for updates!!");
      prms.resetPage();
    }
  }
  deleteDataSuccessHandler(data: any, prms: any) {
    if (data) {
      prms.utilService.alert("success", "Success", "Element data deleted successfully!!");
      prms.resetPage();
    }
  }
  viewRowData(data: any){
    this.rowDetails = data;
    this.rowModalHeader = data.DataRow;
    let currentBreadCrumb:any[] = _.cloneDeep(this.utilService.BREADCRUMB);
    if(currentBreadCrumb.length > 2)
      currentBreadCrumb.splice(currentBreadCrumb.length-1,1);
    this.utilService.clearBreadcrumb();
    this.utilService.transferRowData(data);
    currentBreadCrumb.forEach((menu: any) => {
      let styleClass = 'custom-menu'
      this.utilService.pushToBreadcrumb(menu.label, menu.icon, menu.routerLink, menu.queryParams, menu.commandType, menu.commandDesc, styleClass);
    })
    this.utilService.pushToBreadcrumb(this.rowModalHeader, 'fa fa-th-list', '', null, 'DASHBOARD_RELOAD', 'ROW_REPORT', 'custom-active-menu');
  }
  onToggle(data: any){
    this.isCollapsed = data.collapsed;
    let domObj = document.getElementById('reportPanel')
    domObj?.classList.remove("file-report-scroll");
    domObj?.classList.remove("file-report-scroll-toggle");
    if(this.isCollapsed){
      this.tableRowCount = 12;
      domObj?.classList.add("file-report-scroll-toggle");
    } else{
      this.tableRowCount = 8;
      domObj?.classList.add("file-report-scroll");
    }
    if (this.migrationData)
      this.migrationData.reset();
  }
  resetTagStyles(){
    document.getElementById('totalTag')?.classList.remove("custom-report-tag");
    document.getElementById('upsTag')?.classList.remove("custom-report-tag");
    document.getElementById('upfTag')?.classList.remove("custom-report-tag");
    document.getElementById('vsTag')?.classList.remove("custom-report-tag");
    document.getElementById('vfTag')?.classList.remove("custom-report-tag");
    document.getElementById('msTag')?.classList.remove("custom-report-tag");
    document.getElementById('mfTag')?.classList.remove("custom-report-tag");
    document.getElementById('totalTag')?.classList.remove("custom-report-tag-selected");
    document.getElementById('upsTag')?.classList.remove("custom-report-tag-selected");
    document.getElementById('upfTag')?.classList.remove("custom-report-tag-selected");
    document.getElementById('vsTag')?.classList.remove("custom-report-tag-selected");
    document.getElementById('vfTag')?.classList.remove("custom-report-tag-selected");
    document.getElementById('msTag')?.classList.remove("custom-report-tag-selected");
    document.getElementById('mfTag')?.classList.remove("custom-report-tag-selected");
    document.getElementById('totalTag')?.classList.add("custom-report-tag");
    document.getElementById('upsTag')?.classList.add("custom-report-tag");
    document.getElementById('upfTag')?.classList.add("custom-report-tag");
    document.getElementById('vsTag')?.classList.add("custom-report-tag");
    document.getElementById('vfTag')?.classList.add("custom-report-tag");
    document.getElementById('msTag')?.classList.add("custom-report-tag");
    document.getElementById('mfTag')?.classList.add("custom-report-tag");
  }
  openModal(template: TemplateRef<any>, cssClass: string) {
    this.modalRef = this.modalService.show(template, {
      class: cssClass, keyboard: false,
      backdrop: true,
      ignoreBackdropClick: true
    });
  }
  hideModal() {
    this.isReqSubmitted = false;
    this.modalRef.hide()
  }
  saveRecordData(){
    this.isReqSubmitted = true;
  }
  onRequestSubmit(data: any) {
    if (data.status == 'SUCCESS') {
      this.hideModal();
      this.isReqSubmitted = false;
    } else {
      setTimeout(() => {
        this.isReqSubmitted = false;
      });
    }
  }
  serviceErrorHandler(response: any, status: any, errorText: any, prms: any) {
    prms.curComp.utilService.alert('error', 'Error', 'Service error, please contact administrator!!', false);
  }
  errorHandler(response: any, prms: any) {
    prms.utilService.alert('error', 'Error', 'Service error, please contact administrator!!', false);
  }
  onPagination(buttonType: any){
    if (!this.isBackDisabled && buttonType == 'DOUBLE_BACKWARD'){
      this.currentPageNumber = 1;
      this.refreshData(0,this.filterType)
    } else if (!this.isBackDisabled && buttonType == 'BACKWARD') {
      this.currentPageNumber = this.currentPageNumber - 1;
      if(this.currentPageNumber == 1){
        this.refreshData(0, this.filterType)
      } else{
        this.refreshData((this.currentPageNumber -1) * this.tableRowCount, this.filterType)
      }
    } else if (!this.isFrontDisabled && buttonType == 'FORWARD') {
      this.currentPageNumber = this.currentPageNumber + 1;
      this.refreshData((this.currentPageNumber - 1) * this.tableRowCount, this.filterType)
    } else if (!this.isFrontDisabled && buttonType == 'DOUBLE_FORWARD') {
      this.currentPageNumber = Math.ceil(this.totalRecordCount / this.tableRowCount)
      this.refreshData((this.currentPageNumber - 1) * this.tableRowCount, this.filterType)
    }
  }
  resetPage(){
    this.resetTableVisibility();
    this.resetTagStyles();
    let domObj: any = {};
    if (this.source == 'INGESTION_REPORT') {
      this.filterType = 'UPLOAD_SUCCESS';
      domObj = document.getElementById('upsTag')
    } else if (this.source == 'VALIDATION_REPORT') {
      this.filterType = 'VALIDATE_SUCCESS';
      domObj = document.getElementById('vsTag')
    } else if (this.source == 'MIGRATION_REPORT') {
      this.filterType = 'MIGRATE_SUCCESS';
      domObj = document.getElementById('msTag')
    }
    this.setTableInfo();
    this.refreshData(0, this.filterType);
    domObj?.classList.remove('custom-report-tag')
    domObj?.classList.add("custom-report-tag-selected");
  }
}