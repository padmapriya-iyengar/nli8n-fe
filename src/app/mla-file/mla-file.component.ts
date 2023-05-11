import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UtilityService } from 'src/app/commons/utilities.service';
import { MLA_FILE } from 'src/app/entities/mla-file';
import * as _ from "lodash";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'mla-file',
  templateUrl: './mla-file.component.html',
  styleUrls: ['./mla-file.component.scss']
})
export class MlaFileComponent implements OnInit, OnChanges {
  constructor(private utilService: UtilityService, private datePipe: DatePipe,
    private route: ActivatedRoute) {  }

  readOnly: boolean = false;
  mlaFile!: MLA_FILE;
  allFileDivisions: any[] = [];
  fileDivisions: any[] = [];
  header1: any[] = [];
  header2: any[] = [];
  year: any[] = [];
  todaysDate: Date = new Date();
  caseTypes: any[] = [];
  caseSubTypes: any[] = [];
  caseStatus: any[] = [];
  secClassification: any[] = [];
  fileOrigin: any[] = [];
  fileCmplxts: any[] = [];
  reqUnder: any[] = [];
  fatfPurposes: any[] = [];
  showForeignAgencyDetails: boolean = false;
  showLocalAgencyDetails: boolean = true;
  cfList: any[] = [];
  fAgencyTypes: any[] = [];
  fAgencyNames: any[] = [];
  lAgencyTypes: any[] = [];
  lAgencyNames: any[] = [];
  @ViewChild('mlaFileForm') reqForm!: NgForm;
  formSubmitted: boolean = false;
  @Input() modalSubmit: boolean = false;
  @Output() reqSubmit = new EventEmitter<any>();
  alertMessages: any[] = [];
  fileDivisionItemIDMap: Map<string,string> = new Map<string, string>();
  fileHeader1ItemIDMap: Map<string, string> = new Map<string, string>();
  fileHeader2ItemIDMap: Map<string, string> = new Map<string, string>();
  localAgencyTypeCodeIDMap: Map<string, string> = new Map<string, string>();
  foreignAgencyTypeCodeIDMap: Map<string, string> = new Map<string, string>();
  foreignAgencyCountryCodeIDMap: Map<string, string> = new Map<string, string>();
  urlParams: string = '';
  requestNumber!: string | null;
  showSpinner: boolean = false;

  ngOnInit(): void {
    this.showSpinner = true;
    this.formSubmitted = false;
    this.mlaFile = new MLA_FILE();
    this.getAGItemID()
    this.getFileOrigins();
    this.getCaseStatus();
    this.getSecurityClassifications();
    this.getFileComplexity();
    this.getFATFPurpose();
    this.mlaFile.FileType = 'MLA';
    this.urlParams = window.location.href;
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['modalSubmit'].currentValue) {
      this.onSubmit()
    }
  }
  onRequestOriginChange(data: any){
    if (data.value == 'ADDR_F'){
      this.showLocalAgencyDetails = false;
      this.showForeignAgencyDetails = true;
      this.getForeignCountries();
    } else{
      this.showLocalAgencyDetails = true;
      this.showForeignAgencyDetails = false;
      this.getLocalAgencyTypes();
    }
    this.mlaFile.LocalOrForeign = data.value
  }
  onForeignAgencyCountryChange(data: any) {
    this.getForeignAgencyTypes(this.foreignAgencyCountryCodeIDMap.get(data.value));
  }
  getFileOrigins() {
    //Service Implementation
    this.fileOrigin = [];
    this.fileOrigin = [
      { label: 'Local', value: 'ADDR_L' },
      { label: 'Foreign', value: 'ADDR_F' },
    ];
    this.mlaFile.LocalForeign = 'ADDR_L'
    this.mlaFile.LocalOrForeign = 'ADDR_L'
    this.getLocalAgencyTypes();
  }
  getCaseTypes() {
    this.caseTypes = [];
    this.mlaFile.MLACaseType = '';
    //Service Integration
    let response = {"CodeTables":[{"CodeTables-id":{"Id":"390850","ItemId":"002248573547A1ECA03AED61BD366817.390850"},"DisplayOrder":"2","IsMigrated":"false","I_TB_ParentID":null,"AlternateKey":null,"I_TB_ParentCode":null,"Code":"EXTRADITION","Name":"Extradition","Category":"MLA_CASE_TYPE","Status":"A","CodeId":"4477","Title":{"Value":"CODE-000031751"}},{"CodeTables-id":{"Id":"390849","ItemId":"002248573547A1ECA03AED61BD366817.390849"},"DisplayOrder":"1","IsMigrated":"false","I_TB_ParentID":null,"AlternateKey":null,"I_TB_ParentCode":null,"Code":"MLA","Name":"MLA","Category":"MLA_CASE_TYPE","Status":"A","CodeId":"4476","Title":{"Value":"CODE-000031750"}}]}
    this.getMasterDataSuccessHandler(response,'MLA_CASE_TYPE')
  }
  getCaseSubTypes() {
    this.caseSubTypes = [];
    this.mlaFile.MLASubType='';
    //Service Integration
    let response = {"CodeTables":[{"CodeTables-id":{"Id":"390852","ItemId":"002248573547A1ECA03AED61BD366817.390852"},"DisplayOrder":"1","IsMigrated":"false","I_TB_ParentID":null,"AlternateKey":null,"I_TB_ParentCode":null,"Code":"I","Name":"Incoming","Category":"MLA_CASE_SUB_TYPE","Status":"A","CodeId":"4478","Title":{"Value":"CODE-000031753"}},{"CodeTables-id":{"Id":"390853","ItemId":"002248573547A1ECA03AED61BD366817.390853"},"DisplayOrder":"2","IsMigrated":"false","I_TB_ParentID":null,"AlternateKey":null,"I_TB_ParentCode":null,"Code":"O","Name":"Outgoing","Category":"MLA_CASE_SUB_TYPE","Status":"A","CodeId":"4479","Title":{"Value":"CODE-000031754"}}]}
    this.getMasterDataSuccessHandler(response,'MLA_CASE_SUB_TYPE')
  }
  getAGItemID(){
    //Service Integration
    let response = {"FileRefNoFormat":{"ChildType":"V_PS_CM_DIVISION","MetadataCategory":null,"I_IW_ParentId":null,"WorkOnMatterIndicator":"N","I_RefNoDN":null,"IsMigrated":null,"I_ParentItemID":null,"I_IW_ID":"1","Status":"A","I_ChildDescription":null,"I_FileType":null,"FormatID":"100001","I_ChildType":"CUSTOM","BFRComplexity":null,"RetentionPeriodType":null,"Description":"Attorney-General","ReferenceNoDN":"AG","I_ChildCode":null,"FileType":null,"RetentionPeriodValue":null,"Code":"AG","FileRefNoFormat-id":{"Id":"294915","ItemId":"002248573547A1ECA330FA604440E819.294915"},"Title":{"Value":"AG","@xmlns":"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0","@xmlns:wstxns3":"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0"},"@xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","@xmlns:wstxns1":"http://schemas/AGCSIWMasterData/FileRefNoFormat/operations","@xmlns":"http://schemas/AGCSIWMasterData/FileRefNoFormat","@xmlns:wstxns2":"http://schemas/AGCSIWMasterData/FileRefNoFormat"},"@xmlns:wstxns1":"http://schemas/AGCSIWMasterData/FileRefNoFormat/operations","@xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance"}
    let resp = response.FileRefNoFormat
    if (resp) {
      this.getFileDivisions(resp['FileRefNoFormat-id']['ItemId'])
    }
  }
  getFileDivisions(agItemID: string) {
    this.allFileDivisions = [];
    //Service Integration
    let response = {"FileRefNoFormat":[{"ParentCode":{"FileRefNoFormat-id":{"Id":"294915","ItemId":"002248573547A1ECA330FA604440E819.294915"}},"Title":{"Value":"ADM"},"ChildType":"CUSTOM","MetadataCategory":null,"I_IW_ParentId":"1","WorkOnMatterIndicator":"N","I_RefNoDN":null,"IsMigrated":null,"I_ParentItemID":null,"I_IW_ID":"10","Status":"I","I_ChildDescription":null,"I_FileType":null,"FormatID":"100002","I_ChildType":"CUSTOM","BFRComplexity":null,"RetentionPeriodType":null,"Description":"ADM","ReferenceNoDN":"AG/ADM","I_ChildCode":null,"FileType":null,"RetentionPeriodValue":null,"Code":"ADM","FileRefNoFormat-id":{"Id":"294913","ItemId":"002248573547A1ECA330FA604440E819.294913"}},{"ParentCode":{"FileRefNoFormat-id":{"Id":"294915","ItemId":"002248573547A1ECA330FA604440E819.294915"}},"Title":{"Value":"FTCD"},"ChildType":"CUSTOM","MetadataCategory":null,"I_IW_ParentId":"1","WorkOnMatterIndicator":"N","I_RefNoDN":null,"IsMigrated":null,"I_ParentItemID":null,"I_IW_ID":"5","Status":"A","I_ChildDescription":null,"I_FileType":null,"FormatID":"2479","I_ChildType":"CUSTOM","BFRComplexity":null,"RetentionPeriodType":null,"Description":"Financial and Technology Crime Division","ReferenceNoDN":"AG/FTCD","I_ChildCode":null,"FileType":null,"RetentionPeriodValue":null,"Code":"FTCD","FileRefNoFormat-id":{"Id":"294914","ItemId":"002248573547A1ECA330FA604440E819.294914"}},{"ParentCode":{"FileRefNoFormat-id":{"Id":"294915","ItemId":"002248573547A1ECA330FA604440E819.294915"}},"Title":{"Value":"CJFS"},"ChildType":"CUSTOM","MetadataCategory":null,"I_IW_ParentId":"1","WorkOnMatterIndicator":"N","I_RefNoDN":null,"IsMigrated":null,"I_ParentItemID":null,"I_IW_ID":"15","Status":"I","I_ChildDescription":null,"I_FileType":null,"FormatID":"102324","I_ChildType":"CUSTOM","BFRComplexity":null,"RetentionPeriodType":null,"Description":"CJFS","ReferenceNoDN":"AG/CJFS","I_ChildCode":null,"FileType":null,"RetentionPeriodValue":null,"Code":"CJFS","FileRefNoFormat-id":{"Id":"294916","ItemId":"002248573547A1ECA330FA604440E819.294916"}},{"ParentCode":{"FileRefNoFormat-id":{"Id":"294915","ItemId":"002248573547A1ECA330FA604440E819.294915"}},"Title":{"Value":"LPS"},"ChildType":"CUSTOM","MetadataCategory":null,"I_IW_ParentId":"1","WorkOnMatterIndicator":"N","I_RefNoDN":null,"IsMigrated":null,"I_ParentItemID":null,"I_IW_ID":"2","Status":"A","I_ChildDescription":null,"I_FileType":null,"FormatID":"1308","I_ChildType":"CUSTOM","BFRComplexity":null,"RetentionPeriodType":null,"Description":"LPS","ReferenceNoDN":"AG/LPS","I_ChildCode":null,"FileType":null,"RetentionPeriodValue":null,"Code":"LPS","FileRefNoFormat-id":{"Id":"294917","ItemId":"002248573547A1ECA330FA604440E819.294917"}}]}
    this.getChildEntriesSuccessHandler(response,'DIVISION')
  }
  getCurrentUserFileDivisions(){
    this.fileDivisions = [];
    //Service Integration
    let response = {"Groups":{"FunctionalGroup":{"FunctionalGroup-id":{"Id":"49155","ItemId":"002248573547A1ECA0C26352C534A817.49155"},"GroupName":"IAD","GroupCreatedInOTDS":"Yes","IsDivision":"true","IsChild":"No","GroupDescription":"International Affairs Division","GroupType":"Functional","UserLinkedToGroup":{"@nil":"true"},"Status":"A","Title":{"Value":"IAD"}}}}
    if (response.Groups){
      let resp = response.Groups.FunctionalGroup;
      let index = _.findIndex(this.allFileDivisions, function (fg: any) { return fg.value == resp.Title.Value; })
        if (index != -1) {
          this.fileDivisions.push({ label: resp.GroupName, value: resp.Title.Value })
        }
    }
  }
  getChildEntriesSuccessHandler(response: any, type: any) {
    let resp = response.FileRefNoFormat;
    if(resp){
      if (!resp.length) {
        if (type == 'DIVISION') {
          this.allFileDivisions.push({ label: resp.Code, value: resp.Code })
          this.fileDivisionItemIDMap.set(resp.Code, resp['FileRefNoFormat-id']['ItemId'])
          this.getCurrentUserFileDivisions();
        }
        if (type == 'HEADER1') {
          if (resp.FileType && (resp.FileType == "MLA" || resp.FileType == "EXT")) {
            this.header1.push({ label: resp.Code, value: resp.Code })
            this.fileHeader1ItemIDMap.set(resp.Code, resp['FileRefNoFormat-id']['ItemId'])
          }
        }
        if (type == 'HEADER2') {
          this.header2.push({ label: resp.Code, value: resp.Code })
          this.fileHeader2ItemIDMap.set(resp.Code, resp['FileRefNoFormat-id']['ItemId'])
        }
      } else if (resp.length > 0) {
        if (type == 'DIVISION') {
          resp.forEach((child: any) => {
            this.allFileDivisions.push({ label: child.Code, value: child.Code })
            this.fileDivisionItemIDMap.set(child.Code, child['FileRefNoFormat-id']['ItemId'])
          })
          this.getCurrentUserFileDivisions();
        }
        if (type == 'HEADER1') {
          resp.forEach((child: any) => {
            if (child.FileType && (child.FileType == "MLA" || child.FileType == "EXT")) {
              this.header1.push({ label: child.Code, value: child.Code })
              this.fileHeader1ItemIDMap.set(child.Code, child['FileRefNoFormat-id']['ItemId'])
            }
          })
        }
        if (type == 'HEADER2') {
          resp.forEach((child: any) => {
            this.header2.push({ label: child.Code, value: child.Code })
            this.fileHeader2ItemIDMap.set(child.Code, child['FileRefNoFormat-id']['ItemId'])
          })
        }
      }
    }
    this.showSpinner = false;
  }
  getFileHeader1(divItemID: string) {
    this.header1 = []
    //Service Integration
    let response = {"FileRefNoFormat":[{"ParentCode":{"FileRefNoFormat-id":{"Id":"294936","ItemId":"002248573547A1ECA330FA604440E819.294936"}},"Title":{"Value":"ADM-S"},"ChildType":"YEAR","MetadataCategory":null,"I_IW_ParentId":"22","WorkOnMatterIndicator":"N","I_RefNoDN":null,"IsMigrated":null,"I_ParentItemID":null,"I_IW_ID":"360","Status":"A","I_ChildDescription":null,"I_FileType":null,"FormatID":"103096","I_ChildType":"CUSTOM","BFRComplexity":null,"RetentionPeriodType":null,"Description":"IAD ADMINISTRATION","ReferenceNoDN":"AG/IAD/ADM-S","I_ChildCode":null,"FileType":"Generic","RetentionPeriodValue":null,"Code":"ADM-S","FileRefNoFormat-id":{"Id":"295266","ItemId":"002248573547A1ECA330FA604440E819.295266"}},{"ParentCode":{"FileRefNoFormat-id":{"Id":"294936","ItemId":"002248573547A1ECA330FA604440E819.294936"}},"Title":{"Value":"AIR"},"ChildType":"CUSTOM","MetadataCategory":"ADVICE","I_IW_ParentId":"22","WorkOnMatterIndicator":"Y","I_RefNoDN":null,"IsMigrated":null,"I_ParentItemID":null,"I_IW_ID":"361","Status":"A","I_ChildDescription":null,"I_FileType":null,"FormatID":"103098","I_ChildType":"CUSTOM","BFRComplexity":null,"RetentionPeriodType":null,"Description":"AVIATION AND SPACE MATTERS","ReferenceNoDN":"AG/IAD/AIR","I_ChildCode":null,"FileType":"Advisory","RetentionPeriodValue":null,"Code":"AIR","FileRefNoFormat-id":{"Id":"295269","ItemId":"002248573547A1ECA330FA604440E819.295269"}},{"ParentCode":{"FileRefNoFormat-id":{"Id":"294936","ItemId":"002248573547A1ECA330FA604440E819.294936"}},"Title":{"Value":"ADM"},"ChildType":"CUSTOM","MetadataCategory":null,"I_IW_ParentId":"22","WorkOnMatterIndicator":"N","I_RefNoDN":null,"IsMigrated":null,"I_ParentItemID":null,"I_IW_ID":"358","Status":"A","I_ChildDescription":null,"I_FileType":null,"FormatID":"103078","I_ChildType":"CUSTOM","BFRComplexity":"2","RetentionPeriodType":null,"Description":"IAD ADMINISTRATION","ReferenceNoDN":"AG/IAD/ADM","I_ChildCode":null,"FileType":"Generic","RetentionPeriodValue":"0","Code":"ADM","FileRefNoFormat-id":{"Id":"295270","ItemId":"002248573547A1ECA330FA604440E819.295270"}},{"ParentCode":{"FileRefNoFormat-id":{"Id":"294936","ItemId":"002248573547A1ECA330FA604440E819.294936"}},"Title":{"Value":"AIR-C"},"ChildType":"CUSTOM","MetadataCategory":null,"I_IW_ParentId":"22","WorkOnMatterIndicator":"N","I_RefNoDN":null,"IsMigrated":null,"I_ParentItemID":null,"I_IW_ID":"362","Status":"A","I_ChildDescription":null,"I_FileType":null,"FormatID":"103103","I_ChildType":"CUSTOM","BFRComplexity":null,"RetentionPeriodType":null,"Description":"AVIATION AND SPACE MATTERS","ReferenceNoDN":"AG/IAD/AIR-C","I_ChildCode":null,"FileType":"Advisory","RetentionPeriodValue":null,"Code":"AIR-C","FileRefNoFormat-id":{"Id":"295273","ItemId":"002248573547A1ECA330FA604440E819.295273"}},{"ParentCode":{"FileRefNoFormat-id":{"Id":"294936","ItemId":"002248573547A1ECA330FA604440E819.294936"}},"Title":{"Value":"ADM-C"},"ChildType":"YEAR","MetadataCategory":null,"I_IW_ParentId":"22","WorkOnMatterIndicator":"N","I_RefNoDN":null,"IsMigrated":null,"I_ParentItemID":null,"I_IW_ID":"359","Status":"A","I_ChildDescription":null,"I_FileType":null,"FormatID":"103093","I_ChildType":"CUSTOM","BFRComplexity":null,"RetentionPeriodType":null,"Description":"IAD ADMINISTRATION","ReferenceNoDN":"AG/IAD/ADM-C","I_ChildCode":null,"FileType":"Generic","RetentionPeriodValue":null,"Code":"ADM-C","FileRefNoFormat-id":{"Id":"295274","ItemId":"002248573547A1ECA330FA604440E819.295274"}}]}
    this.getChildEntriesSuccessHandler(response,'HEADER1');
  }
  getFileHeader2(header1ItemID: string) {
    this.header2 = []
    //Service Integration
    let response = {"FileRefNoFormat":[{"ParentCode":{"FileRefNoFormat-id":{"Id":"295269","ItemId":"002248573547A1ECA330FA604440E819.295269"}},"Title":{"Value":"1"},"ChildType":"YEAR","MetadataCategory":null,"I_IW_ParentId":"361","WorkOnMatterIndicator":"N","I_RefNoDN":null,"IsMigrated":null,"I_ParentItemID":null,"I_IW_ID":"10781","Status":"A","I_ChildDescription":null,"I_FileType":null,"FormatID":"103099","I_ChildType":"CUSTOM","BFRComplexity":null,"RetentionPeriodType":null,"Description":"1","ReferenceNoDN":"AG/IAD/AIR/1","I_ChildCode":null,"FileType":null,"RetentionPeriodValue":null,"Code":"1","FileRefNoFormat-id":{"Id":"305690","ItemId":"002248573547A1ECA330FA604440E819.305690"}},{"ParentCode":{"FileRefNoFormat-id":{"Id":"295269","ItemId":"002248573547A1ECA330FA604440E819.295269"}},"Title":{"Value":"2"},"ChildType":"YEAR","MetadataCategory":null,"I_IW_ParentId":"361","WorkOnMatterIndicator":"N","I_RefNoDN":null,"IsMigrated":null,"I_ParentItemID":null,"I_IW_ID":"10782","Status":"A","I_ChildDescription":null,"I_FileType":null,"FormatID":"103100","I_ChildType":"CUSTOM","BFRComplexity":null,"RetentionPeriodType":null,"Description":"2","ReferenceNoDN":"AG/IAD/AIR/2","I_ChildCode":null,"FileType":null,"RetentionPeriodValue":null,"Code":"2","FileRefNoFormat-id":{"Id":"305693","ItemId":"002248573547A1ECA330FA604440E819.305693"}},{"ParentCode":{"FileRefNoFormat-id":{"Id":"295269","ItemId":"002248573547A1ECA330FA604440E819.295269"}},"Title":{"Value":"FIRS"},"ChildType":"YEAR","MetadataCategory":null,"I_IW_ParentId":"361","WorkOnMatterIndicator":"N","I_RefNoDN":null,"IsMigrated":null,"I_ParentItemID":null,"I_IW_ID":"10783","Status":"A","I_ChildDescription":null,"I_FileType":null,"FormatID":"103101","I_ChildType":"CUSTOM","BFRComplexity":null,"RetentionPeriodType":null,"Description":"FIRS","ReferenceNoDN":"AG/IAD/AIR/FIRS","I_ChildCode":null,"FileType":null,"RetentionPeriodValue":null,"Code":"FIRS","FileRefNoFormat-id":{"Id":"305696","ItemId":"002248573547A1ECA330FA604440E819.305696"}},{"ParentCode":{"FileRefNoFormat-id":{"Id":"295269","ItemId":"002248573547A1ECA330FA604440E819.295269"}},"Title":{"Value":"TRAF"},"ChildType":"YEAR","MetadataCategory":null,"I_IW_ParentId":"361","WorkOnMatterIndicator":"N","I_RefNoDN":null,"IsMigrated":null,"I_ParentItemID":null,"I_IW_ID":"10784","Status":"A","I_ChildDescription":null,"I_FileType":null,"FormatID":"103102","I_ChildType":"CUSTOM","BFRComplexity":null,"RetentionPeriodType":null,"Description":"Traffic","ReferenceNoDN":"AG/IAD/AIR/TRAF","I_ChildCode":null,"FileType":null,"RetentionPeriodValue":null,"Code":"TRAF","FileRefNoFormat-id":{"Id":"305700","ItemId":"002248573547A1ECA330FA604440E819.305700"}}]}
    this.getChildEntriesSuccessHandler(response,'HEADER2');
  }
  getFileYear() {
    this.year = []
    //Service Integration
    let response = {"CodeTables":{"CodeTables-id":{"Id":"390867","ItemId":"002248573547A1ECA03AED61BD366817.390867"},"DisplayOrder":"1","IsMigrated":"false","I_TB_ParentID":null,"AlternateKey":null,"I_TB_ParentCode":null,"Code":"FILE_YEAR","Name":"50","Category":"FILE_YEAR","Status":"A","CodeId":"4489","Title":{"Value":"CODE-000031768"}}}
    this.getMasterDataSuccessHandler(response,'FILE_YEAR')
  }
  getFileComplexity() {
    this.fileCmplxts = [];
    //Service Integration
    let response = {"CodeTables":[{"CodeTables-id":{"Id":"386276","ItemId":"002248573547A1ECA03AED61BD366817.386276"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"CC-C","I_TB_ParentCode":null,"Code":"CC_C","Name":"Complex","Category":"CASE_COMPLEXITY","Status":"A","CodeId":"100","Title":{"Value":"CODE-000027177"}},{"CodeTables-id":{"Id":"491527","ItemId":"002248573547A1ECA03AED61BD366817.491527"},"DisplayOrder":"2","IsMigrated":"true","I_TB_ParentID":"0","AlternateKey":"CC-C","I_TB_ParentCode":null,"Code":"CC_C","Name":"Complex","Category":"CASE_COMPLEXITY","Status":"A","CodeId":"0","Title":{"Value":"CODE-000031810"}},{"CodeTables-id":{"Id":"386277","ItemId":"002248573547A1ECA03AED61BD366817.386277"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"CC-EC","I_TB_ParentCode":null,"Code":"CC_EX","Name":"Extremely Complex","Category":"CASE_COMPLEXITY","Status":"A","CodeId":"101","Title":{"Value":"CODE-000027178"}},{"CodeTables-id":{"Id":"386278","ItemId":"002248573547A1ECA03AED61BD366817.386278"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"CC-S","I_TB_ParentCode":null,"Code":"CC_S","Name":"Simple","Category":"CASE_COMPLEXITY","Status":"A","CodeId":"102","Title":{"Value":"CODE-000027179"}},{"CodeTables-id":{"Id":"491546","ItemId":"002248573547A1ECA03AED61BD366817.491546"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":"0","AlternateKey":"CC-S","I_TB_ParentCode":null,"Code":"CC_S","Name":"Simple","Category":"CASE_COMPLEXITY","Status":"A","CodeId":"0","Title":{"Value":"CODE-000031829"}}]}
    this.getMasterDataSuccessHandler(response,'CASE_COMPLEXITY')
  }
  getSecurityClassifications() {
    this.secClassification = [];
    //Service Integration
    let response = {"CodeTables":[{"CodeTables-id":{"Id":"387436","ItemId":"002248573547A1ECA03AED61BD366817.387436"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":null,"I_TB_ParentCode":null,"Code":"EAT_BFRIPO","Name":"BFR IP Outcome","Category":"EXTERNAL_AGENCY_TYPE","Status":"A","CodeId":"1216","Title":{"Value":"CODE-000028337"}},{"CodeTables-id":{"Id":"387437","ItemId":"002248573547A1ECA03AED61BD366817.387437"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":null,"I_TB_ParentCode":null,"Code":"EAT_BC","Name":"Board/ Council","Category":"EXTERNAL_AGENCY_TYPE","Status":"A","CodeId":"1217","Title":{"Value":"CODE-000028338"}},{"CodeTables-id":{"Id":"387438","ItemId":"002248573547A1ECA03AED61BD366817.387438"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":null,"I_TB_ParentCode":null,"Code":"EAT_CO","Name":"Country","Category":"EXTERNAL_AGENCY_TYPE","Status":"A","CodeId":"1218","Title":{"Value":"CODE-000028339"}},{"CodeTables-id":{"Id":"387439","ItemId":"002248573547A1ECA03AED61BD366817.387439"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":null,"I_TB_ParentCode":null,"Code":"EAT_EA","Name":"Enforcement Agency","Category":"EXTERNAL_AGENCY_TYPE","Status":"A","CodeId":"1219","Title":{"Value":"CODE-000028340"}},{"CodeTables-id":{"Id":"387440","ItemId":"002248573547A1ECA03AED61BD366817.387440"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":null,"I_TB_ParentCode":null,"Code":"EAT_GM","Name":"Government Ministry","Category":"EXTERNAL_AGENCY_TYPE","Status":"A","CodeId":"1220","Title":{"Value":"CODE-000028341"}}]}
    this.getMasterDataSuccessHandler(response,'SECURITY_CLASSIFICATION')
  }
  getFATFPurpose(){
    this.fatfPurposes = [];
    //Service Integration
    let response = {"CodeTables":[{"CodeTables-id":{"Id":"386284","ItemId":"002248573547A1ECA03AED61BD366817.386284"},"DisplayOrder":"0","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"CFATFMLTF","I_TB_ParentCode":null,"Code":"CFATF_APO","Name":"Associated Predicate Offences","Category":"CASE_FATF","Status":"A","CodeId":"106","Title":{"Value":"CODE-000027185"}},{"CodeTables-id":{"Id":"386287","ItemId":"002248573547A1ECA03AED61BD366817.386287"},"DisplayOrder":"3","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"CFATFMLTF","I_TB_ParentCode":null,"Code":"CFATF_MLTF","Name":"Money Laundering and Terrorism Financing (ML & TF)","Category":"CASE_FATF","Status":"A","CodeId":"109","Title":{"Value":"CODE-000027188"}},{"CodeTables-id":{"Id":"386285","ItemId":"002248573547A1ECA03AED61BD366817.386285"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"CFATF-ML","I_TB_ParentCode":null,"Code":"CFATF_ML","Name":"Money Laundering only (ML)","Category":"CASE_FATF","Status":"A","CodeId":"107","Title":{"Value":"CODE-000027186"}},{"CodeTables-id":{"Id":"386288","ItemId":"002248573547A1ECA03AED61BD366817.386288"},"DisplayOrder":"4","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"CFATF-NA","I_TB_ParentCode":null,"Code":"CFATF_NA","Name":"Not Applicable (N.A.)","Category":"CASE_FATF","Status":"A","CodeId":"110","Title":{"Value":"CODE-000027189"}},{"CodeTables-id":{"Id":"386286","ItemId":"002248573547A1ECA03AED61BD366817.386286"},"DisplayOrder":"2","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"CFATF-TF","I_TB_ParentCode":null,"Code":"CFATF_TF","Name":"Terrorism Financing only (TF)","Category":"CASE_FATF","Status":"A","CodeId":"108","Title":{"Value":"CODE-000027187"}}]}
    this.getMasterDataSuccessHandler(response,'CASE_FATF')
  }
  getLocalAgencyTypes() {
    this.lAgencyTypes = [];
    //Service Integration
    let response = {"CodeTables":[{"CodeTables-id":{"Id":"389463","ItemId":"002248573547A1ECA03AED61BD366817.389463"},"DisplayOrder":"2","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"C","I_TB_ParentCode":null,"Code":"SCLASS_C","Name":"Confidential","Category":"SECURITY_CLASSIFICATION","Status":"A","CodeId":"3149","Title":{"Value":"CODE-000030364"}},{"CodeTables-id":{"Id":"389464","ItemId":"002248573547A1ECA03AED61BD366817.389464"},"DisplayOrder":"3","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"R","I_TB_ParentCode":null,"Code":"SCLASS_R","Name":"Restricted","Category":"SECURITY_CLASSIFICATION","Status":"A","CodeId":"3150","Title":{"Value":"CODE-000030365"}},{"CodeTables-id":{"Id":"389462","ItemId":"002248573547A1ECA03AED61BD366817.389462"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"S","I_TB_ParentCode":null,"Code":"SCLASS_S","Name":"Secret","Category":"SECURITY_CLASSIFICATION","Status":"A","CodeId":"3148","Title":{"Value":"CODE-000030363"}}]}
    this.getMasterDataSuccessHandler(response,'EXTERNAL_AGENCY_TYPE')
  }
  getForeignCountries() {
    this.cfList = [];
    //Service Integration
    let response = {"CodeTables":[{"CodeTables-id":{"Id":"386568","ItemId":"002248573547A1ECA03AED61BD366817.386568"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"AF","I_TB_ParentCode":null,"Code":"CTRY_AF","Name":"AFGHANISTAN","Category":"COUNTRY","Status":"A","CodeId":"366","Title":{"Value":"CODE-000027469"}},{"CodeTables-id":{"Id":"386569","ItemId":"002248573547A1ECA03AED61BD366817.386569"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"AX","I_TB_ParentCode":null,"Code":"CTRY_AX","Name":"ALAND ISLANDS","Category":"COUNTRY","Status":"A","CodeId":"367","Title":{"Value":"CODE-000027470"}},{"CodeTables-id":{"Id":"386570","ItemId":"002248573547A1ECA03AED61BD366817.386570"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"AL","I_TB_ParentCode":null,"Code":"CTRY_AL","Name":"ALBANIA","Category":"COUNTRY","Status":"A","CodeId":"368","Title":{"Value":"CODE-000027471"}},{"CodeTables-id":{"Id":"386571","ItemId":"002248573547A1ECA03AED61BD366817.386571"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"DZ","I_TB_ParentCode":null,"Code":"CTRY_DZ","Name":"ALGERIA","Category":"COUNTRY","Status":"A","CodeId":"369","Title":{"Value":"CODE-000027472"}},{"CodeTables-id":{"Id":"386572","ItemId":"002248573547A1ECA03AED61BD366817.386572"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"AS","I_TB_ParentCode":null,"Code":"CTRY_AS","Name":"AMERICAN SAMOA","Category":"COUNTRY","Status":"A","CodeId":"370","Title":{"Value":"CODE-000027473"}}]}
    this.getMasterDataSuccessHandler(response,'COUNTRY')
  }
  getForeignAgencyTypes(countryCodeID: any) {
    this.fAgencyTypes = [];
    this.fAgencyNames = [];
    //Service Integration
    let response = {"CodeTables":[{"CodeTables-id":{"Id":"389913","ItemId":"002248573547A1ECA03AED61BD366817.389913"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":"379","AlternateKey":"AU","I_TB_ParentCode":"CTRY_AU","Code":"ATF_AUM","Name":"Ministry","Category":"AGENCY_TYPE_FOREIGN","Status":"A","CodeId":"3558","Title":{"Value":"CODE-000030814"}},{"CodeTables-id":{"Id":"389914","ItemId":"002248573547A1ECA03AED61BD366817.389914"},"DisplayOrder":"2","IsMigrated":"true","I_TB_ParentID":"379","AlternateKey":"AU","I_TB_ParentCode":"CTRY_AU","Code":"ATF_AUJ","Name":"Judiciary","Category":"AGENCY_TYPE_FOREIGN","Status":"A","CodeId":"3559","Title":{"Value":"CODE-000030815"}},{"CodeTables-id":{"Id":"389915","ItemId":"002248573547A1ECA03AED61BD366817.389915"},"DisplayOrder":"3","IsMigrated":"true","I_TB_ParentID":"379","AlternateKey":"AU","I_TB_ParentCode":"CTRY_AU","Code":"ATF_AULE","Name":"Law Enforcement","Category":"AGENCY_TYPE_FOREIGN","Status":"A","CodeId":"3560","Title":{"Value":"CODE-000030816"}}]}
    this.getMasterDataSuccessHandler(response,'AGENCY_TYPE_FOREIGN')
  }
  getCaseStatus() {
    this.caseStatus = [];
    //Service Integration
    let response = {"CodeTables":[{"CodeTables-id":{"Id":"386445","ItemId":"002248573547A1ECA03AED61BD366817.386445"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"C-D","I_TB_ParentCode":null,"Code":"CSTAT_CD","Name":"Closed (Declined)","Category":"CASE_STATUS","Status":"A","CodeId":"256","Title":{"Value":"CODE-000027346"}},{"CodeTables-id":{"Id":"386447","ItemId":"002248573547A1ECA03AED61BD366817.386447"},"DisplayOrder":null,"IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":null,"I_TB_ParentCode":null,"Code":"CSTAT_CEN","Name":"Closed (Executed","Category":"CASE_STATUS","Status":"A","CodeId":"258","Title":{"Value":"CODE-000027348"}},{"CodeTables-id":{"Id":"386446","ItemId":"002248573547A1ECA03AED61BD366817.386446"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"C-E","I_TB_ParentCode":null,"Code":"CSTAT_CE","Name":"Closed (Executed)","Category":"CASE_STATUS","Status":"A","CodeId":"257","Title":{"Value":"CODE-000027347"}},{"CodeTables-id":{"Id":"386448","ItemId":"002248573547A1ECA03AED61BD366817.386448"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"C-I","I_TB_ParentCode":null,"Code":"CSTAT_CI","Name":"Closed (Inactive)","Category":"CASE_STATUS","Status":"A","CodeId":"259","Title":{"Value":"CODE-000027349"}}]}
    this.getMasterDataSuccessHandler(response,'CASE_STATUS')
  }
  getRequestedUnder(caseTypeRequestUnder: string) {
    this.reqUnder = [];
    //Service Integration
    let response = {"CodeTables":[{"CodeTables-id":{"Id":"389416","ItemId":"002248573547A1ECA03AED61BD366817.389416"},"DisplayOrder":"2","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":null,"I_TB_ParentCode":null,"Code":"RUM_2","Name":"ASEAN MLAT","Category":"REQUEST_UNDER_MLA","Status":"A","CodeId":"3108","Title":{"Value":"CODE-000030317"}},{"CodeTables-id":{"Id":"389422","ItemId":"002248573547A1ECA03AED61BD366817.389422"},"DisplayOrder":"8","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":null,"I_TB_ParentCode":null,"Code":"RUM_8","Name":"Bilateral-HK","Category":"REQUEST_UNDER_MLA","Status":"A","CodeId":"3114","Title":{"Value":"CODE-000030323"}},{"CodeTables-id":{"Id":"389420","ItemId":"002248573547A1ECA03AED61BD366817.389420"},"DisplayOrder":"6","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":null,"I_TB_ParentCode":null,"Code":"RUM_6","Name":"Bilateral-India","Category":"REQUEST_UNDER_MLA","Status":"A","CodeId":"3112","Title":{"Value":"CODE-000030321"}},{"CodeTables-id":{"Id":"389421","ItemId":"002248573547A1ECA03AED61BD366817.389421"},"DisplayOrder":"7","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":null,"I_TB_ParentCode":null,"Code":"RUM_7","Name":"Bilateral-US","Category":"REQUEST_UNDER_MLA","Status":"A","CodeId":"3113","Title":{"Value":"CODE-000030322"}},{"CodeTables-id":{"Id":"389419","ItemId":"002248573547A1ECA03AED61BD366817.389419"},"DisplayOrder":"5","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":null,"I_TB_ParentCode":null,"Code":"RUM_5","Name":"Drug Convention","Category":"REQUEST_UNDER_MLA","Status":"A","CodeId":"3111","Title":{"Value":"CODE-000030320"}}]}
    this.getMasterDataSuccessHandler(response,'REQUESTED_UNDER')
  }
  getMasterDataSuccessHandler(response: any, type: any) {
    if (response.CodeTables){
      if (response.CodeTables.length > 0) {
        if (type == 'MLA_CASE_SUB_TYPE') {
          response.CodeTables.forEach((data: any) => {
            this.caseSubTypes.push({ label: data.Name, value: data.Code })
          })
          if (_.includes(this.mlaFile.I_Header1, '-T')) {
            this.mlaFile.MLASubType = 'O'
          } else if (_.includes(this.mlaFile.I_Header1, '-F')) {
            this.mlaFile.MLASubType = 'I'
          }
        }
        if (type == 'SECURITY_CLASSIFICATION') {
          response.CodeTables.forEach((data: any) => {
            this.secClassification.push({ label: data.Name, value: data.Code })
          })
          this.mlaFile.SecurityClassification = 'SCLASS_S'
        }
        if (type == 'CASE_COMPLEXITY') {
          response.CodeTables.forEach((data: any) => {
            this.fileCmplxts.push({ label: data.Name, value: data.Code })
          })
        }
        if (type == 'CASE_FATF') {
          response.CodeTables.forEach((data: any) => {
            this.fatfPurposes.push({ label: data.Name, value: data.Code })
          })
        }
        if (type == 'EXTERNAL_AGENCY_TYPE') {
          response.CodeTables.forEach((data: any) => {
            this.lAgencyTypes.push({ label: data.Name, value: data.Code })
            this.localAgencyTypeCodeIDMap.set(data.Code, data.CodeId);
          })
        }
        if (type == 'COUNTRY') {
          response.CodeTables.forEach((data: any) => {
            this.cfList.push({ label: data.Name, value: data.Code })
            this.foreignAgencyCountryCodeIDMap.set(data.Code, data.CodeId);
          })
        }
        if (type == 'AGENCY_TYPE_FOREIGN') {
          response.CodeTables.forEach((data: any) => {
            this.fAgencyTypes.push({ label: data.Name, value: data.Code })
            this.foreignAgencyTypeCodeIDMap.set(data.Code, data.CodeId);
          })
        }
        if (type == 'MLA_CASE_TYPE') {
          response.CodeTables.forEach((data: any) => {
            this.caseTypes.push({ label: data.Name, value: data.Code })
          })
          if (_.includes(this.mlaFile.I_Header1, 'MLA')){
            this.mlaFile.MLACaseType = 'MLA'
            let data = {
              value: 'MLA'
            }
            this.onCaseTypeChange(data);
          } else if (_.includes(this.mlaFile.I_Header1, 'EXT')) {
            this.mlaFile.MLACaseType = 'EXTRADITION'
            let data = {
              value: 'EXT'
            }
            this.onCaseTypeChange(data);
          }
        }
        if (type == 'CASE_STATUS') {
          response.CodeTables.forEach((data: any) => {
            this.caseStatus.push({ label: data.Name, value: data.Code })
          })
          this.mlaFile.FileStatus = 'CSTAT_DO'
          this.mlaFile.MLACaseStatus = 'CSTAT_DO'
        }
        if (type == 'REQUESTED_UNDER') {
          response.CodeTables.forEach((data: any) => {
            this.reqUnder.push({ label: data.Name, value: data.Code })
          })
        }
      }
      else if (!response.CodeTables.length) {
        let data = response.CodeTables;
        if (type == 'MLA_CASE_SUB_TYPE') {
          this.caseSubTypes.push({ label: data.Name, value: data.Code })
          if (_.includes(this.mlaFile.I_Header1, '-T')) {
            this.mlaFile.MLASubType = 'O'
          } else if (_.includes(this.mlaFile.I_Header1, '-F')) {
            this.mlaFile.MLASubType = 'I'
          }
        }
        if (type == 'SECURITY_CLASSIFICATION') {
          this.secClassification.push({ label: data.Name, value: data.Code })
          this.mlaFile.SecurityClassification = 'SCLASS_S'
        }
        if (type == 'CASE_COMPLEXITY') {
          this.fileCmplxts.push({ label: data.Name, value: data.Code })
        }
        if (type == 'CASE_FATF') {
          this.fatfPurposes.push({ label: data.Name, value: data.Code })
        }
        if (type == 'EXTERNAL_AGENCY_TYPE') {
          this.lAgencyTypes.push({ label: data.Name, value: data.Code })
          this.localAgencyTypeCodeIDMap.set(data.Code, data.CodeId);
        }
        if (type == 'COUNTRY') {
          this.cfList.push({ label: data.Name, value: data.Code })
          this.foreignAgencyCountryCodeIDMap.set(data.Code, data.CodeId);
        }
        if (type == 'AGENCY_TYPE_FOREIGN') {
          this.fAgencyTypes.push({ label: data.Name, value: data.Code })
          this.foreignAgencyTypeCodeIDMap.set(data.Code, data.CodeId);
        }
        if (type == 'MLA_CASE_TYPE') {
          this.caseTypes.push({ label: data.Name, value: data.Code })
          if (_.includes(this.mlaFile.I_Header1, 'MLA')) {
            this.mlaFile.MLACaseType = 'MLA'
            let data = {
              value: 'MLA'
            }
            this.onCaseTypeChange(data);
          } else if (_.includes(this.mlaFile.I_Header1, 'EXT')) {
            this.mlaFile.MLACaseType = 'EXT'
            let data = {
              value: 'EXT'
            }
            this.onCaseTypeChange(data);
          }
        }
        if (type == 'CASE_STATUS') {
          this.caseStatus.push({ label: data.Name, value: data.Code })
          this.mlaFile.FileStatus = 'CSTAT_DO'
          this.mlaFile.MLACaseStatus = 'CSTAT_DO'
        }
        if (type == 'REQUESTED_UNDER') {
          this.reqUnder.push({ label: data.Name, value: data.Code })
        }
        if (type == 'FILE_YEAR') {
          let noOfYears = data.Name;
          for (var i = 0; i < noOfYears; i++) {
            this.year.push({ label: Number((new Date()).getFullYear()) - Number(i), value: Number((new Date()).getFullYear()) - Number(i) })
          }
        }
      }
    }
    if (response.Agency) {
      if (response.Agency.length > 0) {
        if (type == 'EXTERNAL_AGENCY_NAME') {
          response.Agency.forEach((data: any) => {
            this.lAgencyNames.push({ label: data.Description, value: data.AgencyCode })
          })
        }
        if (type == 'AGENCY_NAME_FOREIGN') {
          response.Agency.forEach((data: any) => {
            this.fAgencyNames.push({ label: data.Description, value: data.AgencyCode })
          })
        }
      }
      else if(!response.Agency){
        let data = response.Agency;
        if (type == 'EXTERNAL_AGENCY_NAME') {
          this.lAgencyNames.push({ label: data.Description, value: data.AgencyCode })
        }
        if (type == 'AGENCY_NAME_FOREIGN') {
          this.fAgencyNames.push({ label: data.Description, value: data.AgencyCode })
        }
      }
    }
  }
  onLocalAgencyTypeChange(data: any) {
    this.lAgencyNames = [];
    //Service Integration
    let response = {"Agency":[{"AgencyTypeCode":"EAT_EA","Description":"(OLD) CRIME REGISTRY 2","BuildingName":null,"BlockNo":null,"CountryCode":"CTRY_SG","IsMigrated":null,"AgencyCode":"CB","AddressTypeCode":"ADDR_L","UnitNo":null,"UnFormatAddress":null,"PostalCode":null,"I_TB_ID":"1219","TelephoneNo":null,"StreetName":null,"Status":"A","LevelNo":null,"I_Agency_ID":"45","Agency-id":{"Id":"73752","ItemId":"002248573547A1ECA3CADFEDA165A81A.73752"}},{"AgencyTypeCode":"EAT_EA","Description":"AGENCY ABC","BuildingName":null,"BlockNo":null,"CountryCode":null,"IsMigrated":null,"AgencyCode":"ABC","AddressTypeCode":"ADDR_L","UnitNo":null,"UnFormatAddress":null,"PostalCode":null,"I_TB_ID":"1219","TelephoneNo":null,"StreetName":null,"Status":"A","LevelNo":null,"I_Agency_ID":"46","Agency-id":{"Id":"73754","ItemId":"002248573547A1ECA3CADFEDA165A81A.73754"}},{"AgencyTypeCode":"EAT_EA","Description":"(OLD) ANTI VICE","BuildingName":null,"BlockNo":null,"CountryCode":"CTRY_SG","IsMigrated":null,"AgencyCode":"AVT","AddressTypeCode":"ADDR_L","UnitNo":null,"UnFormatAddress":null,"PostalCode":null,"I_TB_ID":"1219","TelephoneNo":null,"StreetName":null,"Status":"A","LevelNo":null,"I_Agency_ID":"42","Agency-id":{"Id":"73755","ItemId":"002248573547A1ECA3CADFEDA165A81A.73755"}},{"AgencyTypeCode":"EAT_EA","Description":"AIRPORT POLICE","BuildingName":null,"BlockNo":null,"CountryCode":"CTRY_SG","IsMigrated":null,"AgencyCode":"AP","AddressTypeCode":"ADDR_L","UnitNo":null,"UnFormatAddress":null,"PostalCode":null,"I_TB_ID":"1219","TelephoneNo":null,"StreetName":null,"Status":"A","LevelNo":null,"I_Agency_ID":"47","Agency-id":{"Id":"73757","ItemId":"002248573547A1ECA3CADFEDA165A81A.73757"}},{"AgencyTypeCode":"EAT_EA","Description":"CENTRAL POLICE DIVISION HEADQUARTERS","BuildingName":null,"BlockNo":null,"CountryCode":"CTRY_SG","IsMigrated":null,"AgencyCode":"A","AddressTypeCode":"ADDR_L","UnitNo":null,"UnFormatAddress":null,"PostalCode":null,"I_TB_ID":"1219","TelephoneNo":null,"StreetName":null,"Status":"A","LevelNo":null,"I_Agency_ID":"55","Agency-id":{"Id":"73758","ItemId":"002248573547A1ECA3CADFEDA165A81A.73758"}}]}
    this.getMasterDataSuccessHandler(response,'EXTERNAL_AGENCY_NAME')
  }
  onForeignAgencyTypeChange(data: any) {
    this.fAgencyNames = [];
    //Service Integration
    let response = {"Agency":[{"AgencyTypeCode":"ATF_AUM","Description":"Department of Foreign Affairs and Trade","BuildingName":null,"BlockNo":null,"CountryCode":"CTRY_AU","IsMigrated":null,"AgencyCode":"AU_FA","AddressTypeCode":"ADDR_F","UnitNo":null,"UnFormatAddress":null,"PostalCode":null,"I_TB_ID":"3558","TelephoneNo":null,"StreetName":null,"Status":"A","LevelNo":null,"I_Agency_ID":"8145","Agency-id":{"Id":"81852","ItemId":"002248573547A1ECA3CADFEDA165A81A.81852"}},{"AgencyTypeCode":"ATF_AUM","Description":"Attorney-General Department","BuildingName":null,"BlockNo":null,"CountryCode":"CTRY_AU","IsMigrated":null,"AgencyCode":"AU_AG","AddressTypeCode":"ADDR_F","UnitNo":null,"UnFormatAddress":null,"PostalCode":null,"I_TB_ID":"3558","TelephoneNo":null,"StreetName":null,"Status":"A","LevelNo":null,"I_Agency_ID":"8146","Agency-id":{"Id":"81856","ItemId":"002248573547A1ECA3CADFEDA165A81A.81856"}},{"AgencyTypeCode":"ATF_AUM","Description":"Ministry of Defence","BuildingName":null,"BlockNo":null,"CountryCode":"CTRY_AU","IsMigrated":null,"AgencyCode":"AU_MD","AddressTypeCode":"ADDR_F","UnitNo":null,"UnFormatAddress":null,"PostalCode":null,"I_TB_ID":"3558","TelephoneNo":null,"StreetName":null,"Status":"A","LevelNo":null,"I_Agency_ID":"8144","Agency-id":{"Id":"81857","ItemId":"002248573547A1ECA3CADFEDA165A81A.81857"}}]}
    this.getMasterDataSuccessHandler(response,'AGENCY_NAME_FOREIGN')
  }
  onFileDivisionChange(data: any) {
    this.showSpinner = true;
    let divItemID: any = this.fileDivisionItemIDMap.get(data.value);
    this.getFileHeader1(divItemID);
  }
  onFileHeader1Change(data: any) {
    this.showSpinner = true;
    let header1ItemID: any = this.fileHeader1ItemIDMap.get(data.value);
    if (data.value == 'MLA-F'){
      this.mlaFile.I_MLA_HOA = 'HA_MLAI_MACMA'
    } else if (data.value == 'MLA-T'){
      this.mlaFile.I_MLA_HOA = 'HA_MLAO_MACMA'
    } else if (data.value == 'EXTR-T') {
      this.mlaFile.I_MLA_HOA = 'HA_EXTRADITION'
    } else if (data.value == 'EXTR-F') {
      this.mlaFile.I_MLA_HOA = 'HA_EXTRADITION'
    } else{
      this.mlaFile.I_MLA_HOA = ''
    }
    this.getFileHeader2(header1ItemID);
    this.getCaseTypes();
    this.getCaseSubTypes();
  }
  onFileHeader2Change(data: any) {
    this.getFileYear();
  }
  onCaseTypeChange(data: any){
    if (data.value === 'MLA'){
      this.getRequestedUnder('REQUEST_UNDER_MLA');
    } else{
      this.getRequestedUnder('REQUEST_UNDER_EXTRADITION');
    }
  }
  onSubmit() {
    this.formSubmitted = true;
    if (this.reqForm && !this.reqForm.valid) {
      this.reqSubmit.emit({ status: 'FAILURE' });
      this.utilService.alert('error', 'Error', 'Please fill all mandatory details!!', false);
    } else {
      let mla_file:any = _.cloneDeep(this.mlaFile);
      mla_file.MLAReceivedDate = mla_file.MLAReceivedDate ? this.datePipe.transform(mla_file.MLAReceivedDate, "yyyy-MM-dd'T'hh:mm:ss") : null;
      mla_file.MLAFileOpenDate = mla_file.MLAFileOpenDate ? this.datePipe.transform(mla_file.MLAFileOpenDate, "yyyy-MM-dd'T'hh:mm:ss") : null;
      mla_file.MLAOutgoingSentDate = mla_file.MLAOutgoingSentDate ? this.datePipe.transform(mla_file.MLAOutgoingSentDate, "yyyy-MM-dd'T'hh:mm:ss") : null;
      mla_file.MLARequestPerfectedDate = mla_file.MLARequestPerfectedDate ? this.datePipe.transform(mla_file.MLARequestPerfectedDate, "yyyy-MM-dd'T'hh:mm:ss") : null;
      mla_file.Sensitivity = mla_file.Sensitivity == 'Yes' ? true : false
      mla_file.FileCreatedBy = UtilityService.CURRENT_USER_NAME;
      mla_file.FileCreatedDate = this.datePipe.transform(new Date(), "yyyy-MM-dd'T'hh:mm:ss");
    }
  }
}
