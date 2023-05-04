import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { REQUEST_DOCS } from '../entities/document-details';
import { ConfirmationService, TreeNode } from 'primeng/api';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import * as _ from "lodash";
import { UtilityService } from '../commons/utilities.service';
import { DatePipe } from '@angular/common';
import { Table } from 'primeng/table';
declare var jQuery: any;

@Component({
  selector: 'document-upload',
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.scss']
})
export class DocumentUploadComponent  implements OnInit {
  constructor(private modalService: BsModalService, private utilService: UtilityService,
     private datePipe: DatePipe, private confirmationService: ConfirmationService) { }
  docTree!: TreeNode[];
  checkedCount = 0;
  hash: string = "#";
  reqFiles: File[] = [];
  files: REQUEST_DOCS[] = [];
  fileCols: any[] = [];
  file!: REQUEST_DOCS;
  reqItemID!: string;
  reqType!: string;
  readOnly!: string;
  modalRef!: BsModalRef;
  @ViewChild('docDetailsModal') details!: TemplateRef<any>;
  @ViewChild('docVersionsModal') docVersions!: TemplateRef<any>;
  @ViewChild('docMetadataModal') docMetadata!: TemplateRef<any>;
  allFiles: any[] = [];
  updateDocDetails: boolean = false;
  itemDetails: any;
  fileID: string = "";
  requestNo: string = "";
  csPath: string = "";
  progressValue: number = 0;
  showProgress: boolean = false;
  @ViewChild('docsDT') docsDt!: Table;
  selectedIndex: number = -1;
  serviceName: string = "";
  fileDivision: string = "";
  versionData!: any;
  expanded: boolean = false;
  fileReqNos: any[] = [];
  documentTypes: any[] = []
  docTypeCount: Map<string, Number> = new Map<string,Number>();
  docTypeCountList: any[] = [];
  metadata: DOC_METADATA = new DOC_METADATA(); 
  todaysDate: Date = new Date();
  documentType: any[] = [];
  secClassification: any[] = [];
  docMimeStyleMap: Map<string, string> = new Map<string, string>();
  totalFiles: any[] = [];
  noOfRows: number = 15;
  cclInprogressStates: any[] = ['Forward to Assignment within Division', 'Assign within Division','Return to Registry'];
  cclClosedStates: any[] = ['BackCapture', 'Discard', 'Closed', 'Completed', 'Draft']
  itemSubject: string = "";
  userGroups: any[] = [];
  isLOUser: boolean = false;
  isDocBlocked: boolean = false;
  showDelete: boolean = false;
  currentUserName: string = "";

  ngOnInit(): void {
    this.reqType = 'File';
    this.reqItemID = '002248573547A1EC9E9CF72B1B84A817.2473999';
    this.readOnly = 'N'
    this.getLoggedInUserDetails();
    if(this.reqType == 'File'){
      this.fileCols = [
        { field: "FileName", label: "Name", type: "string", spanWidth: "2" },
        { field: "FileDescription", label: "Description", type: "string", spanWidth: "3" },
        { field: "FileVersion", label: "Version", type: "string", spanWidth: "1" },
        { field: "FileClass", label: "Class", type: "string", spanWidth: "1" },
        { field: "FileDate", label: "Doument Date", type: "date", spanWidth: "2" },
      ];
    }
    this.getItemDetails(this.reqType, this.reqItemID);
    this.loadDocMimeTypeStyleClassMap();
    if(this.readOnly == 'Y'){
      this.noOfRows = 15;
    }
    this.checkIfUserIsLO();
  }
  getLoggedInUserDetails() {
    let response = {"tuple":{"old":{"getLoggedInUserDetails":{"getLoggedInUserDetails":{"USER_DETAILS":{"USER_DN":"","USER_NAME":"priya"}}}}}}
    let resp = response.tuple.old.getLoggedInUserDetails.getLoggedInUserDetails.USER_DETAILS;
    if (resp) {
      this.currentUserName = resp.USER_NAME;
    }
  }
  getItemDetails(type: string, itemID: string) {
    let response = {"GenericFile":{"GenericFile-id":{"Id":"2473999","ItemId":"002248573547A1EC9E9CF72B1B84A817.2473999"},"ForeignAgencyTypeDesc":null,"SerialNo":null,"FileCreatedBy":"iadro1","MLADualCriminality":null,"I_MLA_HOA":null,"MLARequestedUnder":null,"DefaultLayoutID":"002248573547A1ECB989DF36749AA81F","I_CourierCostCalculationTrigger":null,"AgencyNameDesc":null,"DashboardURL":"/home/AGC/SIW/#/dashboard","I_RequestNo":null,"LocalOrForeign":null,"MLACaseStatusDesc":null,"MLAPoliticalExposedPerson":null,"FileReferenceNo":"AG/LEGIS/LEG/B/2022/000000002","HistoryURL":"/home/AGC/SIW/#/?history&itemID=002248573547A1EC9E9CF72B1B84A817.2473999&source=File","FileType":"ADVISORY","RecordsFileType":null,"MLASovereignty":null,"I_ForeignAgencyType":null,"RecordsTransferDate":null,"MLANovelLegalSensitiveIssue":null,"SecurityClassificationDesc":null,"MLAContentious":null,"CountryForeignOrgDesc":null,"RecordsConversionRemarks":null,"CaseActivityURL":"/home/AGC/SIW/#/dashboard?caseactivity=File&itemID=002248573547A1EC9E9CF72B1B84A817.2473999","I_MLAFATFPurpose":null,"FileCreatedDate":"2022-06-08T09:25:39Z","LocalForeignDesc":null,"I_AgencyName":null,"RecordsConversionDate":null,"I_Header2":"B","LegisTags":null,"MLADeathPenalty":null,"FileTitle":"Test advisory file Priya","MLACaseStatus":null,"FileSensitivity":null,"MLARequestedUnderDesc":null,"I_CostCalculationTrigger":"False","RecordsDispositionActionDesc":null,"CSPath":"AG/LEGIS/LEG/2022/000000002","MLASubType":null,"I_ParticipantUserName":null,"MLAOffencePunishableByCaning":"false","TopicTags":null,"MLAFATFPurposeDesc":null,"DocumentsURL":"/home/AGC/SIW/#/?source=File&itemID=002248573547A1EC9E9CF72B1B84A817.2473999","MLA_TotalELitigationCost":"0.00","I_Header1":"LEG","I_ForeignAgencyName":null,"MLAReceivedDate":null,"Description":null,"MLA_TotalCourierCost":null,"MLARequestPerfectedDate":null,"ForeignAgencyNameDesc":null,"RecordsDispositionAction":null,"MLAComplexityDesc":null,"RecordsDispositionRemarks":null,"MLAComplexity":null,"I_RequestNos":null,"ForeignAgencyType":null,"ForeignAgencyName":null,"MLASeniorGovtOfficial":"false","MLAOutgoingSentDate":null,"MLAFATFPurpose":null,"FileStatusDesc":null,"I_MLACaseType":null,"RecordsRevisedRetentionPeriod":null,"RecordsLastActionDate":"2022-07-18T15:31:32Z","SecurityClassification":"SCLASS_S","LocalForeign":"ADDR_L","MLAAssignedOfficer":null,"ExtAgencyRefNo":null,"FileID":"F0000000296","FileOwner":"priya","I_MLACaseSubType":null,"I_Edit":"false","I_Year":"2022","IsMigrated":null,"MLASubTypeDesc":null,"Remarks":"Test advisory file Priya","RecordsDispositionDate":null,"AgencyType":"EAT_GM","RecordsRetentionPeriod":null,"MLACaseType":null,"Sensitivity":"true","MLAFileCloseDate":null,"MLAFileOpenDate":null,"I_MLAEdit":"false","AgencyName":"MEWR","CountryForeignOrg":null,"AgencyTypeDesc":null,"LayoutID":"002248573547A1ECA51E73D1F18C681A","I_Division":"LEGIS","FileStatus":null,"AdvisoryPassageOfBill":{"AdvisoryPassageOfBill-id":{"Id":"131073","ItemId":"002248573547A1ECA2984041634F6819.131073"}},"Title":{"Value":"AG/LEGIS/LEG/B/2022/000000002"},"Tracking":{"LastModifiedDate":"2022-07-18T15:32:15Z","CreatedDate":null,"LastModifiedBy":{"Identity-id":{"Id":"164134917","ItemId":"F8B156E1037111E6E9CB0FBF3334FBBF.164134917"}}}}}
    if (this.reqType === 'File' && response.GenericFile) {
      let itemDetails = response.GenericFile
      this.fileID = itemDetails.FileReferenceNo
      this.csPath = itemDetails.CSPath;
      this.serviceName = itemDetails.FileType;
      this.fileDivision = itemDetails.I_Division;
      this.itemSubject = itemDetails.FileTitle;
      this.getDocumentTypes(response.GenericFile.I_Division);
      this.getSecurityClassifications();
    }
  }
  getRequestNosForFile(fileRefNo: string){
    let response = {"GetRequestsResponse":{"GenericRequest":{"LastModifiedBy":{"Identity-id":{"Id":"164134917","ItemId":"F8B156E1037111E6E9CB0FBF3334FBBF.164134917"}},"CreatedBy":{"Identity-id":{"Id":"163971073","ItemId":"F8B156E1037111E6E9CB0FBF3334FBBF.163971073"}},"Tracking":{"LastModifiedDate":"2022-07-18T15:32:32Z","CreatedDate":"2022-07-18T15:30:18Z","LastModifiedBy":{"Identity-id":{"Id":"164134917","ItemId":"F8B156E1037111E6E9CB0FBF3334FBBF.164134917"}},"CreatedBy":{"Identity-id":{"Id":"163971073","ItemId":"F8B156E1037111E6E9CB0FBF3334FBBF.163971073"}}},"MainFile":{"GenericFile-id":{"Id":"2473999","ItemId":"002248573547A1EC9E9CF72B1B84A817.2473999"}},"Lifecycle":{"InstanceIdentifier":"00224857-3547-A1ED-81AB-A043B784E824","CurrentState":"Forward to Assignment / Assign within Division","CurrentStateId":"00224857-3547-A1EC-A2C8-46FBDBF22819","ParentState":"Forward to Assignment / Assign within Division","RootState":"Forward to Assignment / Assign within Division","PriorActivity":"SetFileToRequestRelation","PriorEvent":"All Activity Completion","PreviousState":"FA/ AD Procesing","PreviousStateId":"00224857-3547-A1EC-BC4F-D7459A1B2822","InstanceStatus":"In Progress"},"Title":{"Value":"ADV000000058"},"DateOfDispatch":null,"AssigningOfficer":null,"PostalCode":null,"DueDateChangeRemarks":null,"RequestReceivedModeDesc":"By Fax","IsMigrated":null,"DefaultDocumentsURL":null,"RequestReceivedMode":"RMODE_F","RequestCreatedBy":"iadro1","I_ReqCloseHandler_InstanceID":null,"InternalRequestingDivisionDesc":null,"I_AOUserDN":null,"MainOfficerExists":"true","OfficerEmail":null,"RevisedDueDate":null,"I_Current_AOTaskID":null,"ActionsDraft":"Assign within Division","ActionsClosureReason":"RCR_F","ExpResponseDate":"2022-07-19T12:00:00Z","RequestLocked":"false","CountryForeignOrgDesc":null,"ForeignAgencyType":null,"AllowAO_OOO":"false","ActionsMainOfficer":"false","IsSensitive":"false","RequestorName":"test","Internal":"false","RequestLockedBy":null,"I_ROUserDN":null,"ForeignAgencyTypeDesc":null,"RequestingAgencyRefNo":null,"RequestActions":null,"ActionsLO":"Return to Registry","ComplexityChangeRemarks":null,"ContactNo":null,"OfficerName":null,"DefaultLayoutID":"002248573547A1ECA970AD0E1EFC681B","SecurityClassification":"SCLASS_S","LO_OOO_Message":null,"LayoutID":"002248573547A1ECA2C9120D41FB2819","BlockOrHouseName":null,"ReceivedDate":"2022-07-18T08:59:58Z","RequestingAgencyNameDesc":"MINISTRY OF COMMUNITY DEVELOPMENT, YOUTH And SPORTS","LegisTags":null,"ActionsAssigningOfficer":null,"RequestingAgencyName":"MCYS","RequestingAgencyType":"EAT_GM","RequestTypeDesc":"Advisory","Email":"test@gmail.om","UserDivision":"LEGIS","RequestStatusDesc":"Assigned","OtherAgency":null,"InternalRequestingDivision":null,"CountryForeignOrg":null,"DocumentsURL":"/home/AGC/SIW/#/?source=Request&itemID=002248573547A1EC9F382DC3A9CD6817.2998276","BuildingName":null,"I_LOConsolidation_InstanceID":"00224857-3547-A1ED-81AB-AC35A082E824","AllowLO_OOO":"false","RequestStatus":"RSTAT_A","IsAO_OOO":"false","ComplexityDesc":"Extremely Complex","RequestDueDate":"2022-08-15T00:00:00Z","ActionsRO":null,"RequestClosedDate":null,"RequestCreatedDate":"2022-07-18T09:00:18Z","I_AOGroupDN":null,"ActionsOfficerName":"legislo2","RequestState":"Assign within Division","ForeignAgencyNameDesc":null,"DashboardURL":"/home/AGC/SIW/#/dashboard","UrgencyDesc":"Not Urgent","HistoryURL":"/home/AGC/SIW/#/?history&itemID=002248573547A1EC9F382DC3A9CD6817.2998276&source=Request","Complexity":"RCOMPLEX_EC","StreetName":null,"ActionRemarks":"remarks","RequestNo":"ADV000000058","ActionsAO":null,"I_Current_ROTaskID":null,"LocalForeignDesc":"Local","Remarks":null,"UnitNo":null,"LocalForeign":"ADDR_L","RevisedComplexity":null,"Sensitivity":"true","ForeignAgencyName":null,"CSPath":"AG/LEGIS/LEG/2022/000000002/ADV000000058","ActionsReturnToRegistryReason":"RCR_F","I_MainFileRefNo":"AG/LEGIS/LEG/B/2022/000000002","I_OfficersEmail":null,"LocalOrForeign":null,"SecurityClassificationDesc":"Secret","Urgency":"RURGENT_NU","TopicTags":null,"I_Edit":null,"RequestingAgencyTypeDesc":"Government Ministry","ClosureReasons":null,"OriginalDueDate":"2022-08-15T05:30:00Z","AO_OOO_Message":null,"E_RevisedDueDate":null,"RequestTitle":"Advisory Request LO","RequestType":"RTYPE_ADV","IsLO_OOO":"false","I_ROGroupDN":"","I_TargetTypeValue":"00224857-3547-A1EC-AC2D-A62398BA281B","RequestLockedTime":null,"GenericRequest-id":{"Id":"2998276","ItemId":"002248573547A1EC9F382DC3A9CD6817.2998276"}}}}
    let resp = response.GetRequestsResponse
    if (resp && resp.GenericRequest){
      let data = resp.GenericRequest
        this.fileReqNos.push({ label: data.RequestNo, value: data.RequestNo })
    }
    this.getDocumentsForFile();
    this.loadDocData();
  }
  loadDocData() {
    let children: any[] = [];
    this.fileReqNos.forEach((req:any) => {
      let child:any = {}
      child.label = req.label,
      child.expandedIcon = 'fa fa-folder-open',
      child.collapsedIcon = 'fa fa-folder',
      child.expanded = false,
      child.styleClass = 'doc_tree_child_node'
      children.push(child);
    })
    this.docTree = [
      {
        label: this.fileID,
        expandedIcon: "fa fa-folder-open",
        collapsedIcon: "fa fa-folder",
        expanded: true,
        children: children,
        styleClass: "doc_tree_node_highlight"
      }
    ]
  }
  onSelect(event: any) {
    let aFiles: any[] = [];
    let rFiles: any[] = [];
    aFiles.push(...event.addedFiles)
    rFiles.push(...event.rejectedFiles)
    if (rFiles.length > 0) {
      let fNames: string = '';
      rFiles.forEach(fl => {
        fNames += fl.name + ","
      })
      fNames = fNames.substring(0, fNames.length - 1)
      this.utilService.alert('error', 'Error', 'Cannot upload files - ' + fNames + ' as they exceed the maximum file size 30MB!!', false);
    }
    if (aFiles.length > 0){
      this.reqFiles.push(...event.addedFiles);
      this.allFiles = event.addedFiles;
      this.openModal(this.details, 'xl-modal');
    }
  }
  getDocumentsForFile() {
    this.resetDocTypeCount();
    this.files = [];
    let response = {"tuple":[{"old":{"AWP_DOCUMENTS":{"ID":"300","FILE_NAME":"DateTimePicker.png","SERVICE_TYPE":"ADVISORY","DOCUMENT_URL":"AGC/IW/LEGIS/LEG/2022/000000002/DateTimePicker.png","CS_DOCUMENT_ID":"182136","REQUEST_ID":"","FILE_ID":"AG/LEGIS/LEG/B/2022/000000002","REMARKS":"asdasd","DOCUMENT_DESCRIPTION":"asdasd","DOCUMENT_DATE":"2022-06-07T01:16:59.0","DOCUMENT_VERSION":"1","SECURITY_CLASSIFICATION":"SCLASS_S","FILE_TYPE":"11","CREATED_BY":"iadro1","CREATED_ON":"2022-06-08T07:47:04.270000000","LAST_MODIFIED_BY":null,"LAST_MODIFIED_ON":null,"DOCUMENT_CLASS":"","MIME_TYPE":"image/png","DOCUMENT_FORMAT":"png","OUTGOING":"","FILE_TYPE_DESC":null,"SEC_CLASS_DESC":null,"LEGIS_TAGS":null,"TOPIC_TAGS":null,"KM_NOTES":null}}},{"old":{"AWP_DOCUMENTS":{"ID":"316","FILE_NAME":"ADVISORY_ADDED_FILES.xml","SERVICE_TYPE":"ADVISORY","DOCUMENT_URL":"AGC/IW/LEGIS/LEG/2022/000000002/ADVISORY_ADDED_FILES.xml","CS_DOCUMENT_ID":"218679","REQUEST_ID":"","FILE_ID":"AG/LEGIS/LEG/B/2022/000000002","REMARKS":"asd","DOCUMENT_DESCRIPTION":"asd","DOCUMENT_DATE":"2022-07-12T09:03:24.0","DOCUMENT_VERSION":"1","SECURITY_CLASSIFICATION":"SCLASS_S","FILE_TYPE":"10","CREATED_BY":"iadro1","CREATED_ON":"2022-07-15T03:33:28.907000000","LAST_MODIFIED_BY":null,"LAST_MODIFIED_ON":null,"DOCUMENT_CLASS":"","MIME_TYPE":"text/xml","DOCUMENT_FORMAT":"xml","OUTGOING":"","FILE_TYPE_DESC":null,"SEC_CLASS_DESC":null,"LEGIS_TAGS":null,"TOPIC_TAGS":null,"KM_NOTES":null}}},{"old":{"AWP_DOCUMENTS":{"ID":"337","FILE_NAME":"ADVISORY_ASSIGNMENT_CC.xml","SERVICE_TYPE":"ADVISORY","DOCUMENT_URL":"AGC/IW/LEGIS/LEG/2022/000000002/ADVISORY_ASSIGNMENT_CC.xml","CS_DOCUMENT_ID":"221911","REQUEST_ID":"","FILE_ID":"AG/LEGIS/LEG/B/2022/000000002","REMARKS":"asAS","DOCUMENT_DESCRIPTION":"asAS","DOCUMENT_DATE":"2022-07-24T09:26:56.0","DOCUMENT_VERSION":"1","SECURITY_CLASSIFICATION":"SCLASS_S","FILE_TYPE":"1","CREATED_BY":"iadro1","CREATED_ON":"2022-07-25T03:57:00.597000000","LAST_MODIFIED_BY":null,"LAST_MODIFIED_ON":null,"DOCUMENT_CLASS":"","MIME_TYPE":"text/xml","DOCUMENT_FORMAT":"xml","OUTGOING":"","FILE_TYPE_DESC":"Advice","SEC_CLASS_DESC":"Secret","LEGIS_TAGS":null,"TOPIC_TAGS":null,"KM_NOTES":null}}},{"old":{"AWP_DOCUMENTS":{"ID":"358","FILE_NAME":"ADVISORY_CIR_ROUTE.xml","SERVICE_TYPE":"ADVISORY","DOCUMENT_URL":"AGC/IW/AG/LEGIS/LEG/2022/000000002/ADVISORY_CIR_ROUTE.xml","CS_DOCUMENT_ID":"236758","REQUEST_ID":"","FILE_ID":"AG/LEGIS/LEG/B/2022/000000002","REMARKS":"asdasd","DOCUMENT_DESCRIPTION":"asda","DOCUMENT_DATE":"2022-08-01T09:58:49.0","DOCUMENT_VERSION":"1","SECURITY_CLASSIFICATION":"SCLASS_S","FILE_TYPE":"12","CREATED_BY":"iadro1","CREATED_ON":"2022-08-01T04:28:56.790000000","LAST_MODIFIED_BY":null,"LAST_MODIFIED_ON":null,"DOCUMENT_CLASS":"","MIME_TYPE":"text/xml","DOCUMENT_FORMAT":null,"OUTGOING":"","FILE_TYPE_DESC":"Gazette Notification","SEC_CLASS_DESC":"Secret","LEGIS_TAGS":null,"TOPIC_TAGS":null,"KM_NOTES":null}}},{"old":{"AWP_DOCUMENTS":{"ID":"359","FILE_NAME":"ADVISORY_CROSS_DIV_OFF.xml","SERVICE_TYPE":"ADVISORY","DOCUMENT_URL":"AGC/IW/AG/LEGIS/LEG/2022/000000002/ADVISORY_CROSS_DIV_OFF.xml","CS_DOCUMENT_ID":"236881","REQUEST_ID":"","FILE_ID":"AG/LEGIS/LEG/B/2022/000000002","REMARKS":"fghfghfg","DOCUMENT_DESCRIPTION":"hfgh","DOCUMENT_DATE":"2022-08-01T10:20:39.0","DOCUMENT_VERSION":"1","SECURITY_CLASSIFICATION":"SCLASS_S","FILE_TYPE":"11","CREATED_BY":"iadro1","CREATED_ON":"2022-08-01T04:50:50.063000000","LAST_MODIFIED_BY":null,"LAST_MODIFIED_ON":null,"DOCUMENT_CLASS":"","MIME_TYPE":"text/xml","DOCUMENT_FORMAT":null,"OUTGOING":"","FILE_TYPE_DESC":"File Note","SEC_CLASS_DESC":"Secret","LEGIS_TAGS":null,"TOPIC_TAGS":null,"KM_NOTES":null}}},{"old":{"AWP_DOCUMENTS":{"ID":"362","FILE_NAME":"ADVISORY_DISPATCH_DOC.xml","SERVICE_TYPE":"ADVISORY","DOCUMENT_URL":"AGC/IW/AG/LEGIS/LEG/2022/000000002/ADVISORY_DISPATCH_DOC.xml","CS_DOCUMENT_ID":"237330","REQUEST_ID":"","FILE_ID":"AG/LEGIS/LEG/B/2022/000000002","REMARKS":"Test document upload","DOCUMENT_DESCRIPTION":"Test document upload","DOCUMENT_DATE":"2022-08-01T02:51:20.0","DOCUMENT_VERSION":"1","SECURITY_CLASSIFICATION":"SCLASS_S","FILE_TYPE":"11","CREATED_BY":"iadro1","CREATED_ON":"2022-08-01T09:21:27.940000000","LAST_MODIFIED_BY":null,"LAST_MODIFIED_ON":null,"DOCUMENT_CLASS":"","MIME_TYPE":"text/xml","DOCUMENT_FORMAT":null,"OUTGOING":"","FILE_TYPE_DESC":"File Note","SEC_CLASS_DESC":"Secret","LEGIS_TAGS":null,"TOPIC_TAGS":null,"KM_NOTES":null}}},{"old":{"AWP_DOCUMENTS":{"ID":"366","FILE_NAME":"CIR_ROUTE_HISTORY.xml","SERVICE_TYPE":"ADVISORY","DOCUMENT_URL":"AGC/IW/AG/LEGIS/LEG/2022/000000002/CIR_ROUTE_HISTORY.xml","CS_DOCUMENT_ID":"246477","REQUEST_ID":"","FILE_ID":"AG/LEGIS/LEG/B/2022/000000002","REMARKS":"ASDASD","DOCUMENT_DESCRIPTION":"ASD","DOCUMENT_DATE":"2022-08-01T11:34:43.0","DOCUMENT_VERSION":"1","SECURITY_CLASSIFICATION":"SCLASS_S","FILE_TYPE":"10","CREATED_BY":"iadro1","CREATED_ON":"2022-08-18T06:04:49.283000000","LAST_MODIFIED_BY":null,"LAST_MODIFIED_ON":null,"DOCUMENT_CLASS":"","MIME_TYPE":"text/xml","DOCUMENT_FORMAT":null,"OUTGOING":"","FILE_TYPE_DESC":"Egazette","SEC_CLASS_DESC":"Secret","LEGIS_TAGS":null,"TOPIC_TAGS":null,"KM_NOTES":null}}},{"old":{"AWP_DOCUMENTS":{"ID":"367","FILE_NAME":"CIR_TIMELOG.xml","SERVICE_TYPE":"ADVISORY","DOCUMENT_URL":"AGC/IW/AG/LEGIS/LEG/2022/000000002/CIR_TIMELOG.xml","CS_DOCUMENT_ID":"246367","REQUEST_ID":"","FILE_ID":"AG/LEGIS/LEG/B/2022/000000002","REMARKS":"ASDASD","DOCUMENT_DESCRIPTION":"ASD","DOCUMENT_DATE":"2022-08-01T11:34:43.0","DOCUMENT_VERSION":"1","SECURITY_CLASSIFICATION":"SCLASS_S","FILE_TYPE":"10","CREATED_BY":"iadro1","CREATED_ON":"2022-08-18T06:04:49.297000000","LAST_MODIFIED_BY":null,"LAST_MODIFIED_ON":null,"DOCUMENT_CLASS":"","MIME_TYPE":"text/xml","DOCUMENT_FORMAT":null,"OUTGOING":"","FILE_TYPE_DESC":"Egazette","SEC_CLASS_DESC":"Secret","LEGIS_TAGS":null,"TOPIC_TAGS":null,"KM_NOTES":null}}},{"old":{"AWP_DOCUMENTS":{"ID":"368","FILE_NAME":"CIRCULATION.xml","SERVICE_TYPE":"ADVISORY","DOCUMENT_URL":"AGC/IW/AG/LEGIS/LEG/2022/000000002/CIRCULATION.xml","CS_DOCUMENT_ID":"245707","REQUEST_ID":"","FILE_ID":"AG/LEGIS/LEG/B/2022/000000002","REMARKS":"ASDASD","DOCUMENT_DESCRIPTION":"ASD","DOCUMENT_DATE":"2022-08-01T11:34:43.0","DOCUMENT_VERSION":"1","SECURITY_CLASSIFICATION":"SCLASS_S","FILE_TYPE":"10","CREATED_BY":"iadro1","CREATED_ON":"2022-08-18T06:04:49.360000000","LAST_MODIFIED_BY":null,"LAST_MODIFIED_ON":null,"DOCUMENT_CLASS":"","MIME_TYPE":"text/xml","DOCUMENT_FORMAT":null,"OUTGOING":"","FILE_TYPE_DESC":"Egazette","SEC_CLASS_DESC":"Secret","LEGIS_TAGS":null,"TOPIC_TAGS":null,"KM_NOTES":null}}}]}
    this.getDocDetailsSuccessHandler(response,'FILE_DOC');
  }  
  getDocDetailsSuccessHandler(response: any, type: any) {
    this.totalFiles = [];
    let docDetails = response.tuple;
    if (docDetails){
      if (docDetails.length > 0) {
        if (type == 'FILE_DOC') {
          this.fileReqNos.forEach((req: any) => {
            let docInfo: any = {
              FileName: req.value,
              DocType: 'FOLDER',
              StyleClass: 'fa fa-folder'
            }
            this.files.push(docInfo);
            if(this.docsDt)
              this.docsDt.reset();
          })
        }
        docDetails.forEach((doc: any) => {
          let docInfo: any = {
            FileName: doc.old.AWP_DOCUMENTS.FILE_NAME,
            FileDescription: doc.old.AWP_DOCUMENTS.DOCUMENT_DESCRIPTION,
            FileClass: doc.old.AWP_DOCUMENTS.DOCUMENT_CLASS,
            FileVersion: doc.old.AWP_DOCUMENTS.DOCUMENT_VERSION,
            FileDate: doc.old.AWP_DOCUMENTS.DOCUMENT_DATE,
            ID: doc.old.AWP_DOCUMENTS.ID,
            FileType: doc.old.AWP_DOCUMENTS.FILE_TYPE,
            DocType: type,
            StyleClass: this.docMimeStyleMap.get(doc.old.AWP_DOCUMENTS.MIME_TYPE),
            SecurityClassification: doc.old.AWP_DOCUMENTS.SECURITY_CLASSIFICATION,
            Remarks: doc.old.AWP_DOCUMENTS.REMARKS,
            FileTypeDescription: !this.utilService.isEmpty(doc.old.AWP_DOCUMENTS.FILE_TYPE) ? 
            this.documentTypes[_.findIndex(this.documentTypes, function (dt: any) { return dt.value == doc.old.AWP_DOCUMENTS.FILE_TYPE; })].label : '',
            CreatedBy: doc.old.AWP_DOCUMENTS.CREATED_BY,
            ShowDelete: doc.old.AWP_DOCUMENTS.CREATED_BY == this.currentUserName ? 'Y' : 'N'
          }
          this.totalFiles.push(docInfo)
          if ((type == 'REQ_DOC' || 
            (type == 'FILE_DOC' && this.utilService.isEmpty(doc.old.AWP_DOCUMENTS.REQUEST_ID)))){
              this.files.push(docInfo);
              if(this.docsDt)
                this.docsDt.reset();
              this.docTypeCount.set(doc.old.AWP_DOCUMENTS.FILE_TYPE, _.filter(this.files, { 'FileType': doc.old.AWP_DOCUMENTS.FILE_TYPE }).length)
            }
        })
      } else if (!docDetails.length) {
        if (type == 'FILE_DOC') {
          this.fileReqNos.forEach((req: any) => {
            let docInfo: any = {
              FileName: req.value,
              DocType: 'FOLDER',
              StyleClass: 'fa fa-folder'
            }
            this.files.push(docInfo);
            if(this.docsDt)
              this.docsDt.reset();
          })
        }
        let docInfo: any = {
          FileName: docDetails.old.AWP_DOCUMENTS.FILE_NAME,
          FileDescription: docDetails.old.AWP_DOCUMENTS.DOCUMENT_DESCRIPTION,
          FileClass: docDetails.old.AWP_DOCUMENTS.DOCUMENT_CLASS,
          FileVersion: docDetails.old.AWP_DOCUMENTS.DOCUMENT_VERSION,
          FileDate: docDetails.old.AWP_DOCUMENTS.DOCUMENT_DATE,
          ID: docDetails.old.AWP_DOCUMENTS.ID,
          FileType: docDetails.old.AWP_DOCUMENTS.FILE_TYPE,
          DocType: type,
          StyleClass: this.docMimeStyleMap.get(docDetails.old.AWP_DOCUMENTS.MIME_TYPE),
          SecurityClassification: docDetails.old.AWP_DOCUMENTS.SECURITY_CLASSIFICATION,
          Remarks: docDetails.old.AWP_DOCUMENTS.REMARKS,
          FileTypeDescription: !this.utilService.isEmpty(docDetails.old.AWP_DOCUMENTS.FILE_TYPE) ?
          this.documentTypes[_.findIndex(this.documentTypes, function (dt: any) { return dt.value == docDetails.old.AWP_DOCUMENTS.FILE_TYPE; })].label : '',
          CreatedBy: docDetails.old.AWP_DOCUMENTS.CREATED_BY,
          ShowDelete: docDetails.old.AWP_DOCUMENTS.CREATED_BY == this.currentUserName ? 'Y' : 'N'
        }
        this.totalFiles.push(docInfo);
        if ((type == 'REQ_DOC' ||
          (type == 'FILE_DOC' && this.utilService.isEmpty(docDetails.old.AWP_DOCUMENTS.REQUEST_ID)))){
            this.files.push(docInfo);
            if(this.docsDt)
              this.docsDt.reset();
            this.docTypeCount.set(docDetails.old.AWP_DOCUMENTS.FILE_TYPE, _.filter(this.files, { 'FileType': docDetails.old.AWP_DOCUMENTS.FILE_TYPE }).length)
          }
      }
      this.loadDocTypeCount();
    }
  }
  nodeSelect(event: any) {
    this.files = [];
    this.docTree[0].styleClass = 'doc_tree_root_node'
    this.docTree[0].children?.forEach((child:any) =>{
      child.styleClass = 'doc_tree_child_node'
    })
    if (!event.node.parent){
      this.docTree[0].styleClass = 'doc_tree_node_highlight'
      this.getDocumentsForFile();
    } else{
      let treeNode: any = this.docTree[0].children;
      let cIndex = _.findIndex(treeNode, function (child: any) { return child.label == event.node.label; })
      if (cIndex != -1)
        treeNode[cIndex].styleClass = 'doc_tree_node_highlight'
      this.getDocumentsForRequest(event.node.label);
    }
  }
  nodeUnselect(event: any) {
    this.getDocumentsForFile();
  }
  getDocumentTypes(fileDiv: string) {
    this.documentTypes = [];
    let response = {"DocumentTypes":[{"IsActive":"A","Type":"LEGIS","IsMigrated":null,"DocumentType":"Advice","CodeId":"1","DocumentTypes-id":{"Id":"32902","ItemId":"002248573547A1ECA3C27994E0F4681A.32902"}},{"IsActive":"A","Type":"LEGIS","IsMigrated":null,"DocumentType":"Egazette","CodeId":"10","DocumentTypes-id":{"Id":"32904","ItemId":"002248573547A1ECA3C27994E0F4681A.32904"}},{"IsActive":"A","Type":"LEGIS","IsMigrated":null,"DocumentType":"File Note","CodeId":"11","DocumentTypes-id":{"Id":"32909","ItemId":"002248573547A1ECA3C27994E0F4681A.32909"}},{"IsActive":"A","Type":"LEGIS","IsMigrated":null,"DocumentType":"Gazette Notification","CodeId":"12","DocumentTypes-id":{"Id":"32914","ItemId":"002248573547A1ECA3C27994E0F4681A.32914"}},{"IsActive":"A","Type":"LEGIS","IsMigrated":null,"DocumentType":"Internal Minute","CodeId":"13","DocumentTypes-id":{"Id":"32917","ItemId":"002248573547A1ECA3C27994E0F4681A.32917"}},{"IsActive":"A","Type":"LEGIS","IsMigrated":null,"DocumentType":"Minute","CodeId":"14","DocumentTypes-id":{"Id":"32900","ItemId":"002248573547A1ECA3C27994E0F4681A.32900"}},{"IsActive":"A","Type":"LEGIS","IsMigrated":null,"DocumentType":"Notice of Amendments","CodeId":"15","DocumentTypes-id":{"Id":"32906","ItemId":"002248573547A1ECA3C27994E0F4681A.32906"}},{"IsActive":"A","Type":"LEGIS","IsMigrated":null,"DocumentType":"Notice of Introduction","CodeId":"16","DocumentTypes-id":{"Id":"32910","ItemId":"002248573547A1ECA3C27994E0F4681A.32910"}},{"IsActive":"A","Type":"LEGIS","IsMigrated":null,"DocumentType":"Research/Analysis","CodeId":"17","DocumentTypes-id":{"Id":"32913","ItemId":"002248573547A1ECA3C27994E0F4681A.32913"}},{"IsActive":"A","Type":"LEGIS","IsMigrated":null,"DocumentType":"Revised Act","CodeId":"18","DocumentTypes-id":{"Id":"32918","ItemId":"002248573547A1ECA3C27994E0F4681A.32918"}},{"IsActive":"A","Type":"LEGIS","IsMigrated":null,"DocumentType":"Revised Subsidiary Legislation","CodeId":"19","DocumentTypes-id":{"Id":"32916","ItemId":"002248573547A1ECA3C27994E0F4681A.32916"}},{"IsActive":"A","Type":"LEGIS","IsMigrated":null,"DocumentType":"Assented Copy","CodeId":"2","DocumentTypes-id":{"Id":"32907","ItemId":"002248573547A1ECA3C27994E0F4681A.32907"}},{"IsActive":"A","Type":"LEGIS","IsMigrated":null,"DocumentType":"Second Reading Speech","CodeId":"20","DocumentTypes-id":{"Id":"32920","ItemId":"002248573547A1ECA3C27994E0F4681A.32920"}},{"IsActive":"A","Type":"LEGIS","IsMigrated":null,"DocumentType":"Select Committee","CodeId":"21","DocumentTypes-id":{"Id":"32921","ItemId":"002248573547A1ECA3C27994E0F4681A.32921"}},{"IsActive":"A","Type":"LEGIS","IsMigrated":null,"DocumentType":"Subsidiary Legislation","CodeId":"22","DocumentTypes-id":{"Id":"32923","ItemId":"002248573547A1ECA3C27994E0F4681A.32923"}},{"IsActive":"A","Type":"LEGIS","IsMigrated":null,"DocumentType":"Template","CodeId":"23","DocumentTypes-id":{"Id":"32925","ItemId":"002248573547A1ECA3C27994E0F4681A.32925"}},{"IsActive":"A","Type":"LEGIS","IsMigrated":null,"DocumentType":"Training Material","CodeId":"24","DocumentTypes-id":{"Id":"32919","ItemId":"002248573547A1ECA3C27994E0F4681A.32919"}},{"IsActive":"A","Type":"LEGIS","IsMigrated":null,"DocumentType":"Presentation Copy","CodeId":"25","DocumentTypes-id":{"Id":"32922","ItemId":"002248573547A1ECA3C27994E0F4681A.32922"}},{"IsActive":"A","Type":"LEGIS","IsMigrated":null,"DocumentType":"Map/Plan","CodeId":"26","DocumentTypes-id":{"Id":"32924","ItemId":"002248573547A1ECA3C27994E0F4681A.32924"}},{"IsActive":"A","Type":"LEGIS","IsMigrated":null,"DocumentType":"Bill","CodeId":"3","DocumentTypes-id":{"Id":"32911","ItemId":"002248573547A1ECA3C27994E0F4681A.32911"}},{"IsActive":"A","Type":"LEGIS","IsMigrated":null,"DocumentType":"Cabinet Memo","CodeId":"4","DocumentTypes-id":{"Id":"32898","ItemId":"002248573547A1ECA3C27994E0F4681A.32898"}},{"IsActive":"A","Type":"LEGIS","IsMigrated":null,"DocumentType":"Circular","CodeId":"5","DocumentTypes-id":{"Id":"32903","ItemId":"002248573547A1ECA3C27994E0F4681A.32903"}},{"IsActive":"A","Type":"LEGIS","IsMigrated":null,"DocumentType":"Circulation","CodeId":"6","DocumentTypes-id":{"Id":"32908","ItemId":"002248573547A1ECA3C27994E0F4681A.32908"}},{"IsActive":"A","Type":"LEGIS","IsMigrated":null,"DocumentType":"Consultation Paper","CodeId":"7","DocumentTypes-id":{"Id":"32912","ItemId":"002248573547A1ECA3C27994E0F4681A.32912"}},{"IsActive":"A","Type":"LEGIS","IsMigrated":null,"DocumentType":"Correspondence","CodeId":"8","DocumentTypes-id":{"Id":"32915","ItemId":"002248573547A1ECA3C27994E0F4681A.32915"}},{"IsActive":"A","Type":"LEGIS","IsMigrated":null,"DocumentType":"Corrigendum","CodeId":"9","DocumentTypes-id":{"Id":"32899","ItemId":"002248573547A1ECA3C27994E0F4681A.32899"}}]}
    this.getMasterDataSuccessHandler(response,'DOCUMENT_TYPES')
  }
  getMasterDataSuccessHandler(response: any, type: any) {
    if (response.DocumentTypes) {
      if (response.DocumentTypes.length > 0) {
        if (type == 'DOCUMENT_TYPES') {
          response.DocumentTypes.forEach((data: any) => {
            this.documentTypes.push({ label: data.DocumentType, value: data.CodeId })
          })
        }
      } else if (!response.DocumentTypes.length) {
        let data = response.DocumentTypes;
        if (type == 'DOCUMENT_TYPES') {
          this.documentTypes.push({ label: data.DocumentType, value: data.CodeId })
        }
      }
      if(this.reqType === 'File'){
        this.getRequestNosForFile(this.fileID);
      }
      this.loadDocTypeCount();
    }
    if (response.CodeTables) {
      if (response.CodeTables.length > 0) {
        if (type == 'SECURITY_CLASSIFICATION') {
          response.CodeTables.forEach((data: any) => {
            this.secClassification.push({ label: data.Name, value: data.Code })
          })
        }
      } else if (!response.CodeTables.length) {
        let data = response.CodeTables;
        if (type == 'SECURITY_CLASSIFICATION') {
          this.secClassification.push({ label: data.Name, value: data.Code })
        }
      }
    }
  }
  updateDocumentDetails() {
    this.updateDocDetails = true;
  }
  hideModal() {
    this.updateDocDetails = false;
    this.modalRef.hide()
  }
  openModal(template: TemplateRef<any>, cssClass: string) {
    this.modalRef = this.modalService.show(template, {
      class: cssClass, keyboard: false,
      backdrop: true,
      ignoreBackdropClick: true
    });
  }
  onDetailsSubmit(data: any) {
    if (data.status == 'SUCCESS') {
      this.hideModal();
      if (data.details != null) {
        data.details.forEach((det: any) => {
          let fileObj: REQUEST_DOCS = new REQUEST_DOCS();
          fileObj.FileName = det.fileName;
          fileObj.SecurityClassification = det.securityClassification;
          fileObj.FileType = det.docType;
          fileObj.FileDate = det.docDate;
          fileObj.FileDescription = det.docDescription;
          fileObj.FileRemarks = det.docRemarks;
          fileObj.FileVersion = det.fileVersion;
          fileObj.Base64 = det.base64String;
          fileObj.ID = det.documentId;
          fileObj.MimeType = det.mimeType;
          this.files.push(fileObj);
        })
      }
      this.uploadDocuments(this.files)
    } else {
      setTimeout(() => {
        this.updateDocDetails = false;
      });
    }
  }
  uploadDocuments(filesList: any[]) {
    this.isDocBlocked = true;
    let validDocuments: any[] = [];
    validDocuments = _.filter(filesList, function (file) { return file.Base64 });
    let pendingCount = !validDocuments.length?1:validDocuments.length;
    sessionStorage.setItem("PendingFiles", pendingCount.toString());
    this.showProgress = true;
    filesList.forEach(file => {
      if(file.Base64){
        let dTypeIndex = _.findIndex(this.documentTypes, function (doc) { return doc.value == file.FileType; })
        let sClassIndex = _.findIndex(this.secClassification, function (sClass) { return sClass.value == file.SecurityClassification; })
        let uploadReq: any = {
          uploadRequest: {
            DocumentName: file.FileName,
            Description: file.FileDescription,
            FileRemarks: file.FileRemarks,
            DocumentContent: file.Base64,
            ServiceType: this.serviceName,
            RequestId: this.requestNo,
            FileId: this.fileID,
            Taxonomy: this.csPath,
            DocumentsId: file.ID,
            FileDate: file.FileDate != null ? this.datePipe.transform(file.FileDate, "yyyy-MM-dd'T'hh:mm:ss") : this.datePipe.transform(new Date(), "yyyy-MM-dd'T'hh:mm:ss"),
            SecurityClassification: file.SecurityClassification,
            FileType: file.FileType,
            RequestType: this.reqType,
            ItemID: this.reqItemID,
            MimeType: !this.utilService.isEmpty(file.MimeType) ? file.MimeType : 'application/file',
            DocumentTypeDescription: this.documentTypes[dTypeIndex].label,
            SecurityClassificationDescription: this.secClassification[sClassIndex].label
          }
        }
      }
    })
  }
  uploadDocumentSuccessHandler(response: any, prms: any) {
    let pendingCount = Number(sessionStorage.getItem('PendingFiles')) - 1
    if (pendingCount > 0) {
      sessionStorage.setItem("PendingFiles", pendingCount.toString());
      prms.curComp.progressValue = 100 / (pendingCount + 1);
    } else {
      prms.curComp.progressValue = 100;
      prms.curComp.showProgress = false;
      if (prms.curComp.reqType == 'File'){
        prms.curComp.getDocumentsForFile();
      }
      prms.curComp.utilService.alert('success', 'Success', 'All documents uploaded successfully!!', false);
      prms.curComp.isDocBlocked = false;
    }
  }
  onRowSelected(docData: any){
    this.selectedIndex = docData.index;
    this.showDelete = this.files[this.selectedIndex].ShowDelete == 'Y' ? true : false;
  }
  onRowUnSelected(docData: any) {
    this.showDelete = false;
  }
  deleteDocument(){
    let selectedFile: any = this.file;
    if (!selectedFile || selectedFile.length == 0){
      this.utilService.alert("error", "Error", "Please select a file to delete!!", false)
    } else{
      let docID=this.files[this.selectedIndex].ID;
      let deleteReq = {
        deleteRequest:{
          ID: docID,
          RequestType: this.reqType,
          ItemID: this.reqItemID
        }
      }
    }
  }
  deleteDocumentSuccessHandler(response: any, prms: any) {
    if(response.tuple){
      let resp = response.tuple.old.deleteDocument.deleteDocument;
      if (resp.FILE_DETAILS.STATUS == 'Success'){
        prms.curComp.utilService.alert('success', 'Success', 'Selected document deleted successfully!!', false);
        if (prms.curComp.reqType == 'File') {
          prms.curComp.getDocumentsForFile();
        }
        if(prms.curComp.docsDt)
          prms.curComp.docsDt.reset();
      } else{
        prms.curComp.utilService.alert('error', 'Error', 'Failed to delete the selected document', false);
      }
    }
  }
  downloadDocument(){
    let selectedFile: any = this.file;
    if (!selectedFile || selectedFile.length == 0) {
      this.utilService.alert("error", "Error", "Please select a file to download!!", false)
    } else {
      let docID = this.files[this.selectedIndex].ID;
      let downloadReq = {
        ID: docID,
        VERSION_REQUIRED: false,
        VERSION_NUMBER: 0
      }
    }
  }
  createCirculation(){
    let selectedFile: any = this.file;
    if (!selectedFile || selectedFile.length == 0) {
      this.utilService.alert("error", "Error", "Please select a file to create circulation!!", false)
    } else{
      
    }
  }
  openDocumentVersions(data:any){
    this.versionData = data;
    this.openModal(this.docVersions,'xl-modal')
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
      this.expanded = false;
      event.target.textContent = '...more';
    }
  }
  loadDocTypeCount(){
    this.docTypeCountList = [];
    this.documentTypes.forEach((doc:any) => {
      this.docTypeCountList.push({ label: doc.label, value: this.docTypeCount.get(doc.value)? this.docTypeCount.get(doc.value)?.toString() : '0'});
    })
  }
  resetDocTypeCount(){
    this.docTypeCount = new Map<string, Number>();
    this.docTypeCountList = [];
    this.documentTypes.forEach((doc: any) => {
      this.docTypeCountList.push({ label: doc.label, value: '0' });
    })
  }
  getDocumentsForRequest(reqNo: string){
    this.resetDocTypeCount();
    this.files = [];
    let response = {"@xmlns:SOAP":"http://schemas.xmlsoap.org/soap/envelope/","@xmlns":"http://schemas.agc.com/DocumentsServices"}
    this.getDocDetailsSuccessHandler(response,'REQ_DOC');
  }
  openMetadataEdit(data: any){
    let rowData = _.cloneDeep(data);
    this.metadata.SecurityClassification = rowData.SecurityClassification
    this.metadata.FileDate = rowData.FileDate ? new Date(rowData.FileDate) : null;
    this.metadata.FileType = rowData.FileType
    this.metadata.FileDescription = rowData.FileDescription
    this.metadata.Remarks = rowData.Remarks
    this.metadata.ID = rowData.ID
    this.metadata.FileName = rowData.FileName
    this.openModal(this.docMetadata, 'md-modal')
  }
  getSecurityClassifications() {
    this.secClassification = [];
    let response = {"CodeTables":[{"CodeTables-id":{"Id":"389463","ItemId":"002248573547A1ECA03AED61BD366817.389463"},"DisplayOrder":"2","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"C","I_TB_ParentCode":null,"Code":"SCLASS_C","Name":"Confidential","Category":"SECURITY_CLASSIFICATION","Status":"A","CodeId":"3149","Title":{"Value":"CODE-000030364"}},{"CodeTables-id":{"Id":"389464","ItemId":"002248573547A1ECA03AED61BD366817.389464"},"DisplayOrder":"3","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"R","I_TB_ParentCode":null,"Code":"SCLASS_R","Name":"Restricted","Category":"SECURITY_CLASSIFICATION","Status":"A","CodeId":"3150","Title":{"Value":"CODE-000030365"}},{"CodeTables-id":{"Id":"389462","ItemId":"002248573547A1ECA03AED61BD366817.389462"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"S","I_TB_ParentCode":null,"Code":"SCLASS_S","Name":"Secret","Category":"SECURITY_CLASSIFICATION","Status":"A","CodeId":"3148","Title":{"Value":"CODE-000030363"}}]}
    this.getMasterDataSuccessHandler(response,'SECURITY_CLASSIFICATION')
  }
  updateMetadata(){
    let req = {
      tuple:{
        old:{
          AWP_DOCUMENTS:{
            ID: this.metadata.ID
          }
        },
        new: {
          AWP_DOCUMENTS: {
            ID: this.metadata.ID,
            FILE_TYPE: this.metadata.FileType,
            DOCUMENT_DATE: this.metadata.FileDate ? this.datePipe.transform(this.metadata.FileDate, "yyyy-MM-dd'T'hh:mm:ss") : null,
            DOCUMENT_DESCRIPTION: this.metadata.FileDescription,
            REMARKS: this.metadata.Remarks
          }
        }
      }
    }
  }
  loadDocMimeTypeStyleClassMap(){
    this.docMimeStyleMap.set("audio/aac", "fa fa-file-audio-o")
    this.docMimeStyleMap.set("application/x-abiword", "fa fa-file-word-o")
    this.docMimeStyleMap.set("application/x-freearc", "fa fa-file-archive-o")
    this.docMimeStyleMap.set("image/avif", "fa fa-file-image-o")
    this.docMimeStyleMap.set("video/x-msvideo", "fa fa-file-video-o")
    this.docMimeStyleMap.set("application/vnd.amazon.ebook", "fa fa-book")
    this.docMimeStyleMap.set("application/octet-stream", "fa fa-file-code-o")
    this.docMimeStyleMap.set("image/bmp", "fa fa-file-image-o")
    this.docMimeStyleMap.set("application/x-bzip", "fa fa-file-archive-o")
    this.docMimeStyleMap.set("application/x-bzip2", "fa fa-file-archive-o")
    this.docMimeStyleMap.set("application/x-cdf", "fa fa-file-audio-o")
    this.docMimeStyleMap.set("application/msword", "fa fa-file-word-o")
    this.docMimeStyleMap.set("application/vnd.openxmlformats-officedocument.wordprocessingml.document", "fa fa-file-word-o")
    this.docMimeStyleMap.set("application/epub+zip", "fa fa-file-archive-o")
    this.docMimeStyleMap.set("application/gzip", "fa fa-file-archive-o")
    this.docMimeStyleMap.set("application/java-archive", "fa fa-file-archive-o")
    this.docMimeStyleMap.set("application/vnd.rar", "fa fa-file-archive-o")
    this.docMimeStyleMap.set("application/x-tar", "fa fa-file-archive-o")
    this.docMimeStyleMap.set("application/x-7z-compressed", "fa fa-file-archive-o")
    this.docMimeStyleMap.set("application/zip", "fa fa-file-archive-o")
    this.docMimeStyleMap.set("image/gif", "fa fa-file-image-o")
    this.docMimeStyleMap.set("image/vnd.microsoft.icon", "fa fa-file-image-o")
    this.docMimeStyleMap.set("image/jpeg", "fa fa-file-image-o")
    this.docMimeStyleMap.set("image/png", "fa fa-file-image-o")
    this.docMimeStyleMap.set("image/svg+xml", "fa fa-file-image-o")
    this.docMimeStyleMap.set("image/tiff", "fa fa-file-image-o")
    this.docMimeStyleMap.set("image/webp", "fa fa-file-image-o")
    this.docMimeStyleMap.set("application/vnd.visio", "fa fa-file-image-o")
    this.docMimeStyleMap.set("audio/midi", "fa fa-file-audio-o")
    this.docMimeStyleMap.set("audio/x-midi", "fa fa-file-audio-o")
    this.docMimeStyleMap.set("audio/3gpp2", "fa fa-file-audio-o")
    this.docMimeStyleMap.set("audio/3gpp", "fa fa-file-audio-o")
    this.docMimeStyleMap.set("audio/wav", "fa fa-file-audio-o")
    this.docMimeStyleMap.set("audio/webm", "fa fa-file-audio-o")
    this.docMimeStyleMap.set("audio/opus", "fa fa-file-audio-o")
    this.docMimeStyleMap.set("audio/ogg", "fa fa-file-audio-o")
    this.docMimeStyleMap.set("audio/mpeg", "fa fa-file-audio-o")
    this.docMimeStyleMap.set("video/mp4", "fa fa-file-video-o")
    this.docMimeStyleMap.set("video/mpeg", "fa fa-file-video-o")
    this.docMimeStyleMap.set("video/ogg", "fa fa-file-video-o")
    this.docMimeStyleMap.set("video/mp2t", "fa fa-file-video-o")
    this.docMimeStyleMap.set("video/webm", "fa fa-file-video-o")
    this.docMimeStyleMap.set("video/3gpp", "fa fa-file-video-o")
    this.docMimeStyleMap.set("video/3gpp2", "fa fa-file-video-o")
    this.docMimeStyleMap.set("font/woff", "fa fa-font")
    this.docMimeStyleMap.set("font/woff2", "fa fa-font")
    this.docMimeStyleMap.set("font/ttf", "fa fa-font")
    this.docMimeStyleMap.set("font/otf", "fa fa-font")
    this.docMimeStyleMap.set("application/vnd.ms-fontobject", "fa fa-font")
    this.docMimeStyleMap.set("application/xml", "fa fa-file-code-o")
    this.docMimeStyleMap.set("text/xml", "fa fa-file-code-o")
    this.docMimeStyleMap.set("application/atom+xml", "fa fa-file-code-o")
    this.docMimeStyleMap.set("application/vnd.mozilla.xul+xml", "fa fa-file-code-o")
    this.docMimeStyleMap.set("application/xhtml+xml", "fa fa-file-code-o")
    this.docMimeStyleMap.set("application/ogg", "fa fa-file-code-o")
    this.docMimeStyleMap.set("text/javascript", "fa fa-file-code-o")
    this.docMimeStyleMap.set("text/css", "fa fa-file-code-o")
    this.docMimeStyleMap.set("text/html", "fa fa-file-code-o")
    this.docMimeStyleMap.set("application/json", "fa fa-file-code-o")
    this.docMimeStyleMap.set("application/ld+json", "fa fa-file-code-o")
    this.docMimeStyleMap.set("application/vnd.apple.installer+xml", "fa fa-file-code-o")
    this.docMimeStyleMap.set("application/x-httpd-php", "fa fa-file-code-o")
    this.docMimeStyleMap.set("application/rtf", "fa fa-file-code-o")
    this.docMimeStyleMap.set("application/x-sh", "fa fa-file-code-o")
    this.docMimeStyleMap.set("application/x-shockwave-flash", "fa fa-file-code-o")
    this.docMimeStyleMap.set("application/x-csh", "fa fa-file-code-o")
    this.docMimeStyleMap.set("text/plain", "fa fa-file-text-o")
    this.docMimeStyleMap.set("application/vnd.oasis.opendocument.text", "fa fa-file-text-o")   
    this.docMimeStyleMap.set("application/vnd.ms-powerpoint", "fa fa-file-powerpoint-o")
    this.docMimeStyleMap.set("application/vnd.openxmlformats-officedocument.presentationml.presentation", "fa fa-file-powerpoint-o")
    this.docMimeStyleMap.set("application/vnd.oasis.opendocument.presentation", "fa fa-file-powerpoint-o")
    this.docMimeStyleMap.set("application/vnd.oasis.opendocument.spreadsheet", "fa fa-file-excel-o")
    this.docMimeStyleMap.set("application/vnd.ms-excel", "fa fa-file-excel-o")
    this.docMimeStyleMap.set("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "fa fa-file-excel-o")
    this.docMimeStyleMap.set("text/csv", "fa fa-file-excel-o")
    this.docMimeStyleMap.set("text/calendar", "fa fa-calendar")
    this.docMimeStyleMap.set("application/pdf", "fa fa-file-pdf-o")
    this.docMimeStyleMap.set("application/file", "fa fa-file-o")
  }
  getDocuments(nodeName: string){
    this.docTree[0].styleClass = 'doc_tree_root_node'
    this.docTree[0].children?.forEach((child: any) => {
      child.styleClass = 'doc_tree_child_node'
    })
    let treeNode:any = this.docTree[0].children;
    let cIndex = _.findIndex(treeNode, function (child:any) { return child.label == nodeName; })
    if(cIndex != -1)
      treeNode[cIndex].styleClass = 'doc_tree_node_highlight'
    this.getDocumentsForRequest(nodeName)
  }
  filterDocsByType(docType: string){
    this.files = [];
    let dtIndex = _.findIndex(this.documentTypes, function (type: any) { return type.label == docType; })
    if(dtIndex != -1){
      let dtValue = this.documentTypes[dtIndex].value
      this.files = _.filter(this.totalFiles, { 'FileType': dtValue })
    }
  }
  getTotalFiles(){
    this.resetDocTypeCount();
    this.files = [];
    let response = {"tuple":[{"old":{"AWP_DOCUMENTS":{"ID":"300","FILE_NAME":"DateTimePicker.png","SERVICE_TYPE":"ADVISORY","DOCUMENT_URL":"AGC/IW/LEGIS/LEG/2022/000000002/DateTimePicker.png","CS_DOCUMENT_ID":"182136","REQUEST_ID":"","FILE_ID":"AG/LEGIS/LEG/B/2022/000000002","REMARKS":"asdasd","DOCUMENT_DESCRIPTION":"asdasd","DOCUMENT_DATE":"2022-06-07T01:16:59.0","DOCUMENT_VERSION":"1","SECURITY_CLASSIFICATION":"SCLASS_S","FILE_TYPE":"11","CREATED_BY":"iadro1","CREATED_ON":"2022-06-08T07:47:04.270000000","LAST_MODIFIED_BY":null,"LAST_MODIFIED_ON":null,"DOCUMENT_CLASS":"","MIME_TYPE":"image/png","DOCUMENT_FORMAT":"png","OUTGOING":"","FILE_TYPE_DESC":null,"SEC_CLASS_DESC":null,"LEGIS_TAGS":null,"TOPIC_TAGS":null,"KM_NOTES":null}}},{"old":{"AWP_DOCUMENTS":{"ID":"316","FILE_NAME":"ADVISORY_ADDED_FILES.xml","SERVICE_TYPE":"ADVISORY","DOCUMENT_URL":"AGC/IW/LEGIS/LEG/2022/000000002/ADVISORY_ADDED_FILES.xml","CS_DOCUMENT_ID":"218679","REQUEST_ID":"","FILE_ID":"AG/LEGIS/LEG/B/2022/000000002","REMARKS":"asd","DOCUMENT_DESCRIPTION":"asd","DOCUMENT_DATE":"2022-07-12T09:03:24.0","DOCUMENT_VERSION":"1","SECURITY_CLASSIFICATION":"SCLASS_S","FILE_TYPE":"10","CREATED_BY":"iadro1","CREATED_ON":"2022-07-15T03:33:28.907000000","LAST_MODIFIED_BY":null,"LAST_MODIFIED_ON":null,"DOCUMENT_CLASS":"","MIME_TYPE":"text/xml","DOCUMENT_FORMAT":"xml","OUTGOING":"","FILE_TYPE_DESC":null,"SEC_CLASS_DESC":null,"LEGIS_TAGS":null,"TOPIC_TAGS":null,"KM_NOTES":null}}},{"old":{"AWP_DOCUMENTS":{"ID":"337","FILE_NAME":"ADVISORY_ASSIGNMENT_CC.xml","SERVICE_TYPE":"ADVISORY","DOCUMENT_URL":"AGC/IW/LEGIS/LEG/2022/000000002/ADVISORY_ASSIGNMENT_CC.xml","CS_DOCUMENT_ID":"221911","REQUEST_ID":"","FILE_ID":"AG/LEGIS/LEG/B/2022/000000002","REMARKS":"asAS","DOCUMENT_DESCRIPTION":"asAS","DOCUMENT_DATE":"2022-07-24T09:26:56.0","DOCUMENT_VERSION":"1","SECURITY_CLASSIFICATION":"SCLASS_S","FILE_TYPE":"1","CREATED_BY":"iadro1","CREATED_ON":"2022-07-25T03:57:00.597000000","LAST_MODIFIED_BY":null,"LAST_MODIFIED_ON":null,"DOCUMENT_CLASS":"","MIME_TYPE":"text/xml","DOCUMENT_FORMAT":"xml","OUTGOING":"","FILE_TYPE_DESC":"Advice","SEC_CLASS_DESC":"Secret","LEGIS_TAGS":null,"TOPIC_TAGS":null,"KM_NOTES":null}}},{"old":{"AWP_DOCUMENTS":{"ID":"358","FILE_NAME":"ADVISORY_CIR_ROUTE.xml","SERVICE_TYPE":"ADVISORY","DOCUMENT_URL":"AGC/IW/AG/LEGIS/LEG/2022/000000002/ADVISORY_CIR_ROUTE.xml","CS_DOCUMENT_ID":"236758","REQUEST_ID":"","FILE_ID":"AG/LEGIS/LEG/B/2022/000000002","REMARKS":"asdasd","DOCUMENT_DESCRIPTION":"asda","DOCUMENT_DATE":"2022-08-01T09:58:49.0","DOCUMENT_VERSION":"1","SECURITY_CLASSIFICATION":"SCLASS_S","FILE_TYPE":"12","CREATED_BY":"iadro1","CREATED_ON":"2022-08-01T04:28:56.790000000","LAST_MODIFIED_BY":null,"LAST_MODIFIED_ON":null,"DOCUMENT_CLASS":"","MIME_TYPE":"text/xml","DOCUMENT_FORMAT":null,"OUTGOING":"","FILE_TYPE_DESC":"Gazette Notification","SEC_CLASS_DESC":"Secret","LEGIS_TAGS":null,"TOPIC_TAGS":null,"KM_NOTES":null}}},{"old":{"AWP_DOCUMENTS":{"ID":"359","FILE_NAME":"ADVISORY_CROSS_DIV_OFF.xml","SERVICE_TYPE":"ADVISORY","DOCUMENT_URL":"AGC/IW/AG/LEGIS/LEG/2022/000000002/ADVISORY_CROSS_DIV_OFF.xml","CS_DOCUMENT_ID":"236881","REQUEST_ID":"","FILE_ID":"AG/LEGIS/LEG/B/2022/000000002","REMARKS":"fghfghfg","DOCUMENT_DESCRIPTION":"hfgh","DOCUMENT_DATE":"2022-08-01T10:20:39.0","DOCUMENT_VERSION":"1","SECURITY_CLASSIFICATION":"SCLASS_S","FILE_TYPE":"11","CREATED_BY":"iadro1","CREATED_ON":"2022-08-01T04:50:50.063000000","LAST_MODIFIED_BY":null,"LAST_MODIFIED_ON":null,"DOCUMENT_CLASS":"","MIME_TYPE":"text/xml","DOCUMENT_FORMAT":null,"OUTGOING":"","FILE_TYPE_DESC":"File Note","SEC_CLASS_DESC":"Secret","LEGIS_TAGS":null,"TOPIC_TAGS":null,"KM_NOTES":null}}},{"old":{"AWP_DOCUMENTS":{"ID":"362","FILE_NAME":"ADVISORY_DISPATCH_DOC.xml","SERVICE_TYPE":"ADVISORY","DOCUMENT_URL":"AGC/IW/AG/LEGIS/LEG/2022/000000002/ADVISORY_DISPATCH_DOC.xml","CS_DOCUMENT_ID":"237330","REQUEST_ID":"","FILE_ID":"AG/LEGIS/LEG/B/2022/000000002","REMARKS":"Test document upload","DOCUMENT_DESCRIPTION":"Test document upload","DOCUMENT_DATE":"2022-08-01T02:51:20.0","DOCUMENT_VERSION":"1","SECURITY_CLASSIFICATION":"SCLASS_S","FILE_TYPE":"11","CREATED_BY":"iadro1","CREATED_ON":"2022-08-01T09:21:27.940000000","LAST_MODIFIED_BY":null,"LAST_MODIFIED_ON":null,"DOCUMENT_CLASS":"","MIME_TYPE":"text/xml","DOCUMENT_FORMAT":null,"OUTGOING":"","FILE_TYPE_DESC":"File Note","SEC_CLASS_DESC":"Secret","LEGIS_TAGS":null,"TOPIC_TAGS":null,"KM_NOTES":null}}},{"old":{"AWP_DOCUMENTS":{"ID":"366","FILE_NAME":"CIR_ROUTE_HISTORY.xml","SERVICE_TYPE":"ADVISORY","DOCUMENT_URL":"AGC/IW/AG/LEGIS/LEG/2022/000000002/CIR_ROUTE_HISTORY.xml","CS_DOCUMENT_ID":"246477","REQUEST_ID":"","FILE_ID":"AG/LEGIS/LEG/B/2022/000000002","REMARKS":"ASDASD","DOCUMENT_DESCRIPTION":"ASD","DOCUMENT_DATE":"2022-08-01T11:34:43.0","DOCUMENT_VERSION":"1","SECURITY_CLASSIFICATION":"SCLASS_S","FILE_TYPE":"10","CREATED_BY":"iadro1","CREATED_ON":"2022-08-18T06:04:49.283000000","LAST_MODIFIED_BY":null,"LAST_MODIFIED_ON":null,"DOCUMENT_CLASS":"","MIME_TYPE":"text/xml","DOCUMENT_FORMAT":null,"OUTGOING":"","FILE_TYPE_DESC":"Egazette","SEC_CLASS_DESC":"Secret","LEGIS_TAGS":null,"TOPIC_TAGS":null,"KM_NOTES":null}}}]}
    let docDetails = response.tuple;
    if (docDetails) {
      if (docDetails.length > 0) {
        docDetails.forEach((doc: any) => {
          let docInfo: any = {
            FileName: doc.old.AWP_DOCUMENTS.FILE_NAME,
            FileDescription: doc.old.AWP_DOCUMENTS.DOCUMENT_DESCRIPTION,
            FileClass: doc.old.AWP_DOCUMENTS.DOCUMENT_CLASS,
            FileVersion: doc.old.AWP_DOCUMENTS.DOCUMENT_VERSION,
            FileDate: doc.old.AWP_DOCUMENTS.DOCUMENT_DATE,
            ID: doc.old.AWP_DOCUMENTS.ID,
            FileType: doc.old.AWP_DOCUMENTS.FILE_TYPE,
            DocType: '',
            StyleClass: this.docMimeStyleMap.get(doc.old.AWP_DOCUMENTS.MIME_TYPE),
            SecurityClassification: doc.old.AWP_DOCUMENTS.SECURITY_CLASSIFICATION,
            Remarks: doc.old.AWP_DOCUMENTS.REMARKS,
            FileTypeDescription: !this.utilService.isEmpty(doc.old.AWP_DOCUMENTS.FILE_TYPE) ?
            this.documentTypes[_.findIndex(this.documentTypes, function (dt: any) { return dt.value == doc.old.AWP_DOCUMENTS.FILE_TYPE; })].label : '',
            CreatedBy: doc.old.AWP_DOCUMENTS.CREATED_BY,
            ShowDelete: doc.old.AWP_DOCUMENTS.CREATED_BY == this.currentUserName ? 'Y' : 'N'
          }
          this.files.push(docInfo);
          if(this.docsDt)
            this.docsDt.reset();
          this.docTypeCount.set(doc.old.AWP_DOCUMENTS.FILE_TYPE, _.filter(this.files, { 'FileType': doc.old.AWP_DOCUMENTS.FILE_TYPE }).length)
        })
      }
      this.loadDocTypeCount();
    }
  }
  checkIfUserIsLO(){
    this.userGroups = [];
    let response = {"Groups":{"FunctionalGroup":[{"FunctionalGroup-id":{"Id":"49155","ItemId":"002248573547A1ECA0C26352C534A817.49155"},"GroupName":"IAD","GroupCreatedInOTDS":"Yes","IsDivision":"true","IsChild":"No","GroupDescription":"International Affairs Division","GroupType":"Functional","UserLinkedToGroup":{"@nil":"true"},"Status":"A","Title":{"Value":"IAD"}},{"FunctionalGroup-id":{"Id":"180226","ItemId":"002248573547A1ECA0C26352C534A817.180226"},"GroupName":"Migration Data Admin","GroupCreatedInOTDS":"No","IsDivision":"false","IsChild":"Yes","GroupDescription":"Migration Data Admin","GroupType":"Functional","UserLinkedToGroup":"No","Status":"A","Title":{"Value":"Migration Data Admin"}},{"FunctionalGroup-id":{"Id":"163843","ItemId":"002248573547A1ECA0C26352C534A817.163843"},"GroupName":"SECURITY ADMIN","GroupCreatedInOTDS":"No","IsDivision":"false","IsChild":"Yes","GroupDescription":"Security Administrator","GroupType":"Functional","UserLinkedToGroup":"No","Status":"A","Title":{"Value":"SECURITY ADMIN"}},{"FunctionalGroup-id":{"Id":"1","ItemId":"002248573547A1ECA0C26352C534A817.1"},"GroupName":"AGC","GroupCreatedInOTDS":"Yes","IsDivision":"false","IsChild":"No","GroupDescription":"Attorney General Chambers","GroupType":"Functional","UserLinkedToGroup":{"@nil":"true"},"Status":"A","Title":{"Value":"AGC"}},{"FunctionalGroup-id":{"Id":"49156","ItemId":"002248573547A1ECA0C26352C534A817.49156"},"GroupName":"REGISTRY (IAD)","GroupCreatedInOTDS":"Yes","IsDivision":"false","IsChild":"Yes","GroupDescription":"Registry team of IAD","GroupType":"Functional","UserLinkedToGroup":{"@nil":"true"},"Status":"A","Title":{"Value":"REGISTRY (IAD)"}}]}}
    if (response.Groups) {
      let resp = response.Groups.FunctionalGroup;
      if (resp.length > 0) {
        resp.forEach((fGroup: any) => {
          this.userGroups.push(fGroup.Title.Value)
        })
      }
    }
    if(this.userGroups.length > 0){
      let legalOffCount = _.filter(this.userGroups, function (ug) { return _.includes(ug, 'LEGAL OFFICER'); }).length
      if (legalOffCount > 0){
        this.isLOUser = true;
      }
    }
  }
  getUserGroupsSuccessHandler(response: any, prms: any) {
    
  }
  refreshDocuments(){
    this.getItemDetails(this.reqType, this.reqItemID);
    if (this.readOnly == 'Y') {
      this.noOfRows = 15;
    }
    this.checkIfUserIsLO();
  }
}
export class DOC_METADATA{
  ID!: Number;
  SecurityClassification!: string;
  FileType!: string;
  FileDate!: Date | null;
  FileDescription: string = "";
  Remarks: string = "";
  FileName!: string;
}