import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Table } from 'primeng/table';
import { SIWMigrationService } from '../commons/migration.service';
import { UtilityService } from '../commons/utilities.service';

@Component({
  selector: 'ingestion-report',
  templateUrl: './ingestion-report.component.html',
  styleUrls: ['./ingestion-report.component.scss']
})
export class IngestionReportComponent implements OnInit {
  constructor(private utilService: UtilityService, private modalService: BsModalService,
    private migService: SIWMigrationService, private datePipe: DatePipe) { }
  igtData: any[] = [];
  igtDataCols: any[] = [];
  displayFilters: boolean = false;
  filterEntityName: string = "";
  entityNames: any[] = [];
  filterFromDate: any;
  filterToDate: any;
  todaysDate: Date = new Date();
  usersList: any[] = [];
  filterUploadedBy: string = "";
  filterFileName: string = "";
  selectedIndex: number = -1;
  @Input() clearMenu!: boolean;
  otherColumns: any[] = [];
  otherColumnsData: any[] = [];
  modalRef!: BsModalRef;
  @ViewChild('columnFilterModal') columnFilterModal!: TemplateRef<any>;
  @ViewChild('ingestionData') ingestionData!: Table;
  showSpinner: boolean = false;
  
  ngOnInit(): void {
    if (this.clearMenu)
      this.utilService.clearBreadcrumb();
    this.resetTableCols()
    this.otherColumns = [
      { field: "FILE_STATUS", label: "Status", type: "string", isSelected: false },
      { field: "UPLOAD_DUPLICATE_COUNT", label: "Duplicates", type: "string", isSelected: false }
    ];
    this.refreshData();
  }
  refreshData() {
    this.utilService.clearBreadcrumb();
    this.showSpinner = true;
    this.migService.getReportDetails('INGESTION', this.getReportSuccessHandler, this.errorHandler, this);
  }
  getReportSuccessHandler(data: any, prms: any) {
    prms.igtData = [];
    if (data.tuple){
      if (!data.tuple.length) {
        prms.igtData.push(data.tuple.old.SIW_JOB_FILES)
      } else if (data.tuple.length > 0) {
        data.tuple.forEach((tp: any) => {
          prms.igtData.push(tp.old.SIW_JOB_FILES)
        })
      }
    }
    prms.showSpinner = false;
  }
  openSearch() {
    this.displayFilters = true;
    this.loadEntities();
    this.loadUsersList();
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
  }
  loadUsersList() {
    this.migService.getMigrationAdminUsers(this.getMigrationAdminUsersSuccessHandler, this.errorHandler, this);
  }
  getMigrationAdminUsersSuccessHandler(data: any, prms: any) {
    prms.usersList = [];
    if (data.USER_DETAILS) {
      if (!data.USER_DETAILS.length) {
        prms.usersList.push({ label: data.USER_DETAILS.USER_NAME, value: data.USER_DETAILS.USER_ID })
      } else if (data.USER_DETAILS.length > 0) {
        data.USER_DETAILS.forEach((user: any) => {
          prms.usersList.push({ label: user.USER_NAME, value: user.USER_ID })
        })
      }
    }
  }
  getFilteredSearch() {
    this.displayFilters = false;
    this.showSpinner = true;
    let FILTER_PARAMS: any[] = [];
    let param: any = {};
    if (!this.utilService.isEmpty(this.filterEntityName)){
      param = {
        FILTER_PARAM : {
          PARAM_NAME: 'EntityName',
          PARAM_VALUE: "'" + this.filterEntityName + "'",
          PARAM_OP: 'EQ'
        }
      }
      FILTER_PARAMS.push(param)
    }
    if (!this.utilService.isEmpty(this.filterFileName)) {
      param = {
        FILTER_PARAM : {
          PARAM_NAME: 'FileName',
          PARAM_VALUE: "'" + this.filterFileName + "'",
          PARAM_OP: 'EQ'
        }
      }
      FILTER_PARAMS.push(param)
    }
    if (!this.utilService.isEmpty(this.filterUploadedBy)) {
      param = {
        FILTER_PARAM : {
          PARAM_NAME: 'UploadedBy',
          PARAM_VALUE: "'" + this.filterUploadedBy + "'",
          PARAM_OP: 'EQ'
        }
      }
      FILTER_PARAMS.push(param)
    }
    if (!this.utilService.isEmpty(this.filterFromDate)) {
      param = {
        FILTER_PARAM : {
          PARAM_NAME: 'FromDate',
          PARAM_VALUE: "CAST('" + this.datePipe.transform(this.filterFromDate, "yyyy-MM-dd") + "' AS DATE)",
          PARAM_OP: 'GTEQ'
        }
      }
      FILTER_PARAMS.push(param)
    }
    if (!this.utilService.isEmpty(this.filterToDate)) {
      let newToDate = new Date(this.filterToDate);
      newToDate.setDate(newToDate.getDate() + 1);
      param = {
        FILTER_PARAM : {
          PARAM_NAME: 'ToDate',
          PARAM_VALUE: "CAST('" + this.datePipe.transform(newToDate, "yyyy-MM-dd") + "' AS DATE)",
          PARAM_OP: 'LT'
        }
      }
      FILTER_PARAMS.push(param)
    }
    this.migService.getFilteredReportDetails('INGESTION', FILTER_PARAMS, this.getReportSuccessHandler, this.errorHandler, this);
  }
  onRowSelected(selectedDoc: any) {
    this.selectedIndex = selectedDoc.index;
  }
  onRowUnselected(unselectedDoc: any) {
    this.selectedIndex = -1
  }
  deleteEntry(){
    if (this.selectedIndex != -1) {
      let req = {
        entityName: this.igtData[this.selectedIndex].ENTITY,
        jobFileId: this.igtData[this.selectedIndex].JOB_FILES_ID,
        tableId: ''
      }
    } else {
      this.utilService.alert('error', 'Error', 'Please select a file to delete!!', false);
    }
  }
  validateEntry() {
    if (this.selectedIndex != -1) {
      let req = {
        entityName: this.igtData[this.selectedIndex].ENTITY,
        jobFileId: this.igtData[this.selectedIndex].JOB_FILES_ID,
        tableId: ''
      }
    } else {
      this.utilService.alert('error', 'Error', 'Please select a file to validate!!', false);
    }
  }
  validateDataSuccessHandler(data: any, prms: any) {
    if (data) {
      prms.utilService.alert("success", "Success", "Validation initiated, please check data validation report for updates!!");
      prms.refreshData();
    }
  }
  deleteDataSuccessHandler(data: any, prms: any) {
    if (data) {
      prms.utilService.alert("success", "Success", "File data deleted successfully!!");
      prms.refreshData();
    }
  }
  viewFileReport(data: any){
    let fileName: string = "";
    if (data.FILE_NAME.length > 60){
      fileName = data.FILE_NAME.substring(0,60)+"...";
    } else{
      fileName = data.FILE_NAME
    }
    this.utilService.clearBreadcrumb();
    this.utilService.transferFileData(data);
    this.utilService.setFileReportSource('INGESTION_REPORT');
    this.utilService.pushToBreadcrumb('Ingestion Report', 'fa fa-database', '', null, 'PUSH_TO_MENU', 'INGESTION_REPORT','custom-menu');
    this.utilService.pushToBreadcrumb(fileName, 'fa fa-files-o', '', null, 'DASHBOARD_RELOAD', 'FILE_REPORT', 'custom-active-menu');
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
  onOtherColumnSelect(selectData: any, rowData: any) {
    if (selectData.checked) {
      let cIndex = _.findIndex(this.otherColumnsData, function (col) { return col.field == rowData.field; })
      if (cIndex == -1) {
        this.otherColumnsData.push(rowData)
      }
    } else {
      let cIndex = _.findIndex(this.otherColumnsData, function (col) { return col.field == rowData.field; })
      if (cIndex != -1) {
        this.otherColumnsData.splice(cIndex, 1);
      }
    }
  }
  addNewColumns() {
    this.hideModal();
    this.resetTableCols();
    this.otherColumnsData.forEach(oCol => {
      let cIndex = _.findIndex(this.igtDataCols, function (col) { return col.field == oCol.field; })
      if (cIndex == -1) {
        this.igtDataCols.push(oCol)
      }
    })
  }
  resetTableCols(){
    this.igtDataCols = [
      { field: "ENTITY_DESCRIPTION", label: "Entity Name", type: "string" },
      { field: "FILE_NAME", label: "File Name", type: "string" },
      { field: "UPLOADED_BY", label: "Uploaded By", type: "string" },
      { field: "UPLOADED_ON", label: "Uploaded On", type: "date" },
      { field: "UPLOAD_SUCCESS_COUNT", label: "Upload Success", type: "string" },
      { field: "TOTAL_COUNT", label: "Total Count", type: "string" }
    ];
  }
  serviceErrorHandler(response: any, status: any, errorText: any, prms: any) {
    prms.curComp.utilService.alert('error', 'Error', 'Service error, please contact administrator!!', false);
  }
  errorHandler(response: any, prms: any) {
    prms.utilService.alert('error', 'Error', 'Service error, please contact administrator!!', false);
  }
}
