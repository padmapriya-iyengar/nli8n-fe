import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
import { MigrationService } from '../../commons/services/migration.service';
import { UtilitiesService } from '../../commons/services/utilities.service';

@Component({
  selector: 'record-data',
  templateUrl: './record-data.component.html',
  styleUrls: ['./record-data.component.scss']
})
export class RecordDataComponent implements OnInit {
  constructor(private utilService: UtilitiesService, private migService: MigrationService) { }

  @Input() modalSubmit: boolean = false;
  @Input() fileDetails!: any;
  @Input() rowDetails!: any;
  @Output() reqSubmit = new EventEmitter<any>();
  dataEntityName: string = "";
  entityNames: any[] = [];
  fileName: string = "";
  usersList: any[] = [];
  uploadedBy: string = "";
  fileStatus: string = "";
  fieldInfo: any = []
  isCollapsed: boolean = false;
  panelHeader: string = "";
  iFieldAttrs: Map<String, any[]> = new Map<String, any[]>();
  currentEntObj: any = {};

  ngOnInit(): void {
    if (this.fileDetails) {
      this.fileName = this.fileDetails.fileData.FILE_NAME;
      this.fileStatus = this.fileDetails.fileData.FILE_STATUS;
    }
    this.loadAttrToIgnore();
    this.loadEntities();
    this.loadUsersList();
    this.panelHeader = "Record Details";
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
    prms.dataEntityName = _.toUpper(prms.fileDetails?.fileData?.ENTITY);
    prms.loadFieldInfo();
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
      prms.uploadedBy = prms.fileDetails?.fileData?.UPLOADED_BY
    }
  }
  loadFieldInfo() {
    let req = {
      entityName: this.dataEntityName,
      primaryKey: this.rowDetails?.rowData['TableId']
    }
    this.migService.readMigrationDataObject(req, this.readMigrationDataObjectSuccessHandler, this.errorHandler, this);
  }
  readMigrationDataObjectSuccessHandler(data: any, prms: any) {
    prms.fieldInfo = [];
    if (data[prms.dataEntityName]){
      prms.currentEntObj = data[prms.dataEntityName];
      let entObj = data[prms.dataEntityName];
      for (var attr in entObj) {
        if (entObj.hasOwnProperty(attr)) {
          let cIAttrs: any = prms.iFieldAttrs.get('COMMON');
          let iAttrs: any = prms.iFieldAttrs.get(prms.dataEntityName);
          if (_.indexOf(cIAttrs, attr) == -1 && _.indexOf(iAttrs, attr) == -1){
            prms.fieldInfo.push({ fieldName: attr, fieldValue: data[prms.dataEntityName][attr], fieldDesc: attr })
          }
        }
      }
    }
  }
  onSave() {  
    let newObj = _.cloneDeep(this.currentEntObj);
    let req: any = { tuple: { old: { }, new: { } } };
    let entName = this.dataEntityName;
    this.fieldInfo.forEach((field: any) => {
      newObj[field.fieldName] = field.fieldValue;
    })
    req.tuple.old[entName]={}
    req.tuple.old[entName]['TableId'] = this.currentEntObj['TableId'];
    req.tuple.new[entName] = newObj;
  }
  updateMigrationObjectSuccessHandler(data: any, prms: any) {
    if (data[prms.dataEntityName]){
      prms.reqSubmit.emit({ status: 'SUCCESS' });
      prms.utilService.alert('success', 'Success', 'Record details have been updated successfully!!', false);
    }
  }
  onToggle(data: any) {
    this.isCollapsed = data.collapsed;
    let domObj = document.getElementById('rowPanel')
    domObj?.classList.remove("row-report-scroll");
    domObj?.classList.remove("row-report-scroll-toggle");
    if (this.isCollapsed) {
      domObj?.classList.add("row-report-scroll-toggle");
    } else {
      domObj?.classList.add("row-report-scroll");
    }
  }
  serviceErrorHandler(response: any, status: any, errorText: any, prms: any) {
    prms.curComp.utilService.alert('error', 'Error', 'Service error, please contact administrator!!', false);
  }
  errorHandler(response: any, prms: any) {
    prms.utilService.alert('error', 'Error', 'Service error, please contact administrator!!', false);
  }
  loadAttrToIgnore() {
    this.iFieldAttrs.set('COMMON', ['TableId', 'DMStatus', '@xmlns', 'DMIngestionStatus', 
      'DMIngestionMessage', 'DMValidationStatus', 'DMValidationMessage', 'DMMigrationStatus', 
      'DMMigrationMessage', 'DMFileId', 'DMValidationType', 'JobFileId']);
  }
}