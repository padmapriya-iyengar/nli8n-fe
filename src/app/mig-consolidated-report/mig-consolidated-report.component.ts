import { Component, OnInit, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { Table } from 'primeng/table';
import { SIWMigrationService } from '../commons/migration.service';
import { UtilityService } from '../commons/utilities.service';

@Component({
  selector: 'mig-consolidated-report',
  templateUrl: './mig-consolidated-report.component.html',
  styleUrls: ['./mig-consolidated-report.component.scss']
})
export class MigConsolidatedReportComponent implements OnInit {
  constructor(private utilService: UtilityService, private migService: SIWMigrationService) { }
  migratedData: any[] = [];
  migratedDataCols: any[] = [];
  displayFilters: boolean = false;
  filterEntityName: string = "";
  entityNames: any[] = [];
  filterFromDate: any;
  filterToDate: any;
  todaysDate: Date = new Date();
  showSpinner: boolean = false;

  @ViewChild('migConsData') migConsData!: Table;

  ngOnInit(): void {
    this.utilService.clearBreadcrumb();
    this.migratedDataCols = [
      { field: "ENTITY_DESCRIPTION", label: "Entity Name", type: "string", spanWidth: "2" },
      { field: "TOTAL_COUNT", label: "Total Records", type: "string", spanWidth: "1" },
      { field: "UPLOAD_SUCCESS_COUNT", label: "Upload Success", type: "string", spanWidth: "1" },
      { field: "VALIDATE_SUCCESS_COUNT", label: "Validation Success", type: "string", spanWidth: "1" },
      { field: "VALIDATE_ERROR_COUNT", label: "Validation Fail", type: "string", spanWidth: "1" },
      { field: "MIGRATE_SUCCESS_COUNT", label: "Migration Success", type: "string", spanWidth: "1" },
      { field: "MIGRATE_ERROR_COUNT", label: "Migration Fail", type: "string", spanWidth: "1" }
    ];
    this.refreshData();
  }
  refreshData(){
    this.showSpinner = true;
    this.migService.getConsolidatedReport(this.getConsolidatedReportSuccessHandler, this.errorHandler, this);
  }
  openSearch(){
    this.displayFilters = true;
    this.loadEntities();
  }
  loadEntities(){
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
  getConsolidatedReportSuccessHandler(data: any, prms: any){
    prms.migratedData = [];
    if(data.tuple){
      if (!data.tuple.length) {
        prms.migratedData.push(data.tuple.old.SIW_ENTITIES)
      } else if (data.tuple.length > 0) {
        data.tuple.forEach((tp: any) => {
          prms.migratedData.push(tp.old.SIW_ENTITIES)
        })
      }
    }
    prms.showSpinner = false;
  }
  getFilteredSearch(){
    this.displayFilters = false;
  }
  serviceErrorHandler(response: any, status: any, errorText: any, prms: any) {
    prms.curComp.utilService.alert('error', 'Error', 'Service error, please contact administrator!!', false);
  }
  errorHandler(response: any, prms: any) {
    prms.utilService.alert('error', 'Error', 'Service error, please contact administrator!!', false);
  }
}
