import { Component, Input, OnInit, ViewChild } from '@angular/core';
import * as _ from "lodash";
import { Table } from 'primeng/table';
import { UtilityService } from '../commons/utilities.service';
declare var jQuery: any;

@Component({
  selector: 'document-versions',
  templateUrl: './document-versions.component.html',
  styleUrls: ['./document-versions.component.scss']
})
export class DocumentVersionsComponent implements OnInit {
  constructor(private utilService: UtilityService) { }

  @Input() docDetails!: any;
  @Input() reqType!: string;
  @Input() fileID!: string;
  @Input() requestNo!: string;
  @Input() division!: string;
  fileVersions: any[] = [];
  fileVersionCols: any[] = [];
  @ViewChild('docVersionsDT') docVersionsDt!: Table;
  secClassification: any[] = [];
  documentType: any[] = [];
  expanded: boolean = false;

  ngOnInit(): void {
    this.getAllDocTypes();
    this.getAllSecurityClassifications();
    this.fileVersionCols = [
      { field: "DOCUMENT_DESCRIPTION", label: "Description", type: "string", spanWidth: "3" },
      { field: "FILE_TYPE_NAME", label: "Document Type", type: "string", spanWidth: "2" },
      { field: "SECURITY_CLASSIFICATION_NAME", label: "Security Classification", type: "string", spanWidth: "1" },
      { field: "DOCUMENT_VERSION", label: "Version", type: "string", spanWidth: "1" },
      { field: "DOCUMENT_CLASS", label: "Class", type: "string", spanWidth: "1" },
      { field: "DOCUMENT_DATE", label: "Document Date", type: "date", spanWidth: "1" }
    ]
  }
  getAllSecurityClassifications() {
    let response = {"CodeTables":[{"CodeTables-id":{"Id":"389463","ItemId":"002248573547A1ECA03AED61BD366817.389463"},"DisplayOrder":"2","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"C","I_TB_ParentCode":null,"Code":"SCLASS_C","Name":"Confidential","Category":"SECURITY_CLASSIFICATION","Status":"A","CodeId":"3149","Title":{"Value":"CODE-000030364"}},{"CodeTables-id":{"Id":"389464","ItemId":"002248573547A1ECA03AED61BD366817.389464"},"DisplayOrder":"3","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"R","I_TB_ParentCode":null,"Code":"SCLASS_R","Name":"Restricted","Category":"SECURITY_CLASSIFICATION","Status":"A","CodeId":"3150","Title":{"Value":"CODE-000030365"}},{"CodeTables-id":{"Id":"389462","ItemId":"002248573547A1ECA03AED61BD366817.389462"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"S","I_TB_ParentCode":null,"Code":"SCLASS_S","Name":"Secret","Category":"SECURITY_CLASSIFICATION","Status":"A","CodeId":"3148","Title":{"Value":"CODE-000030363"}}]}
    this.getMasterDataSuccessHandler(response,'SECURITY_CLASSIFICATION')
  }
  getAllDocTypes() {
    let response = {"CodeTables":[{"CodeTables-id":{"Id":"389463","ItemId":"002248573547A1ECA03AED61BD366817.389463"},"DisplayOrder":"2","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"C","I_TB_ParentCode":null,"Code":"SCLASS_C","Name":"Confidential","Category":"SECURITY_CLASSIFICATION","Status":"A","CodeId":"3149","Title":{"Value":"CODE-000030364"}},{"CodeTables-id":{"Id":"389464","ItemId":"002248573547A1ECA03AED61BD366817.389464"},"DisplayOrder":"3","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"R","I_TB_ParentCode":null,"Code":"SCLASS_R","Name":"Restricted","Category":"SECURITY_CLASSIFICATION","Status":"A","CodeId":"3150","Title":{"Value":"CODE-000030365"}},{"CodeTables-id":{"Id":"389462","ItemId":"002248573547A1ECA03AED61BD366817.389462"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"S","I_TB_ParentCode":null,"Code":"SCLASS_S","Name":"Secret","Category":"SECURITY_CLASSIFICATION","Status":"A","CodeId":"3148","Title":{"Value":"CODE-000030363"}}]}
    this.getMasterDataSuccessHandler(response,'DOCUMENT_TYPES')
  }
  getMasterDataSuccessHandler(response: any, type: any) {
    if (response.CodeTables) {
      if (response.CodeTables.length > 0) {
        if (type == 'SECURITY_CLASSIFICATION') {
          response.CodeTables.forEach((data: any) => {
            this.secClassification.push({ label: data.Name, value: data.Code })
          })
          this.getFileVersions();
        }
      } else if (!response.CodeTables.length) {
        let data = response.CodeTables;
        if (type == 'SECURITY_CLASSIFICATION') {
          this.secClassification.push({ label: data.Name, value: data.Code })
          this.getFileVersions();
        }
      }
    }
    if (response.DocumentTypes) {
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
  getFileVersions(){
    if(this.reqType == 'File'){
      let response = {"tuple":{"old":{"AWP_DOCUMENT_VERSIONS":{"ID":"447","FILE_NAME":"CIRCULATION.xml","SERVICE_TYPE":"ADVISORY","DOCUMENT_URL":"AGC/IW/AG/LEGIS/LEG/2022/000000002/CIRCULATION.xml","CS_DOCUMENT_ID":"245707","REQUEST_ID":"","FILE_ID":"AG/LEGIS/LEG/B/2022/000000002","REMARKS":"ASDASD","DOCUMENT_DESCRIPTION":"ASD","DOCUMENT_DATE":"2022-08-01T11:34:43.0","DOCUMENT_VERSION":"1","SECURITY_CLASSIFICATION":"SCLASS_S","FILE_TYPE":"10","DOCUMENT_CLASS":"","CREATED_BY":"iadro1","CREATED_ON":"2022-08-18T06:04:50.190000000","LAST_MODIFIED_BY":null,"LAST_MODIFIED_ON":null,"AWP_DOC_ID":"368","MIME_TYPE":"text/xml","DOCUMENT_FORMAT":null,"OUTGOING":"","FILE_TYPE_DESC":"Egazette","SEC_CLASS_DESC":"Secret","LEGIS_TAGS":null,"TOPIC_TAGS":null,"KM_NOTES":null,"FILE_TYPE_NAME":"Test File Type","SECURITY_CLASSIFICATION_NAME":"Security Classification Name"}}}}
      if(response.tuple){
        let sIndex = _.findIndex(this.secClassification, function (sc:any) { return sc.value == response.tuple.old.AWP_DOCUMENT_VERSIONS.SECURITY_CLASSIFICATION })
        let fIndex = _.findIndex(this.documentType, function (dt: any) { return dt.value == response.tuple.old.AWP_DOCUMENT_VERSIONS.FILE_TYPE })
        if(fIndex != -1)
          response.tuple.old.AWP_DOCUMENT_VERSIONS.FILE_TYPE_NAME = this.documentType[fIndex].label
        if(sIndex != -1)
          response.tuple.old.AWP_DOCUMENT_VERSIONS.SECURITY_CLASSIFICATION_NAME = this.secClassification[sIndex].label
        this.fileVersions.push(response.tuple.old.AWP_DOCUMENT_VERSIONS)
      }
    }
  }
  downloadDocument(data: any) {
    let docID = this.docDetails.ID;
    let docVersion = data.DOCUMENT_VERSION
    let downloadReq = {
      ID: docID,
      VERSION_REQUIRED: true,
      VERSION_NUMBER: docVersion
    }
  }
  checkOverflow($event: any) {
    if ($event.offsetHeight < $event.scrollHeight ||
      $event.offsetWidth < $event.scrollWidth) {
      return true;
    } else {
      return false;
    }
  }
  textFinalData(event: any, rowdata: any, dts: any, col: any) {
    if (event.target.textContent == "...more") {
      jQuery(col).height('auto');
      jQuery(col).parent().height('auto');
      this.expanded = true;
      event.target.textContent = '..less';
    } else {
      jQuery(col).height('3em');
      jQuery(col).parent().height('4em');
      this.expanded = false
      event.target.textContent = '...more';
    }
  }
}
