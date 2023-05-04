import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UtilityService } from 'src/app/commons/utilities.service';
import { ADVISORY_FILE } from 'src/app/entities/advisory-file';
import * as _ from "lodash";
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'advisory-file',
  templateUrl: './advisory-file.component.html',
  styleUrls: ['./advisory-file.component.scss']
})
export class AdvisoryFileComponent implements OnInit, OnChanges{
  constructor(private utilService: UtilityService, 
    private route: ActivatedRoute, private datePipe: DatePipe) { }

  fileDetails: any[] = [];
  advisoryFile!: ADVISORY_FILE;
  readOnly: boolean = false;
  secClassification: any[] = [];
  allFileDivisions: any[] = [];
  fileDivisions: any[] = [];
  header1: any[]=[];
  header2: any[]=[];
  year: any[]=[];
  localAgencyNames: any[]=[];
  localAgencyTypes: any[]=[];
  foreignAgencyNames: any[]=[];
  foreignAgencyTypes: any[]=[];
  fileOrigin: any[]=[];
  fileOwners: any[]=[];
  todaysDate: Date = new Date();
  agcFileReFNo: string='';
  fileSerialNumber:number=0;
  @ViewChild('advfileForm') advfileForm!: NgForm;
  formSubmitted: boolean = false;
  @Input() modalSubmit: boolean = false;
  @Output() reqSubmit = new EventEmitter<any>();
  alertMessages: any[]=[];
  showForeignAgencyDetails: boolean = false;
  showLocalAgencyDetails: boolean = true;
  foreignCountries: any[]=[];
  fileDivisionItemIDMap: Map<string, string> = new Map<string, string>();
  fileHeader1ItemIDMap: Map<string, string> = new Map<string, string>();
  fileHeader2ItemIDMap: Map<string, string> = new Map<string, string>();
  localAgencyTypeCodeIDMap: Map<string, string> = new Map<string, string>();
  foreignAgencyTypeCodeIDMap: Map<string, string> = new Map<string, string>();
  foreignAgencyCountryCodeIDMap: Map<string, string> = new Map<string, string>();
  requestNumber!: string | null;
  showSpinner: boolean = false;

  ngOnInit(): void {
    this.showSpinner = true;
    this.formSubmitted = false;
    this.advisoryFile = new ADVISORY_FILE();
    this.getFileOrigins();
    this.getSecurityClassifications();
    this.getAGItemID()
    this.getFileOwners();
    this.advisoryFile.FileType = 'ADVISORY';
  }
  ngOnChanges(changes: SimpleChanges) {
      if (changes['modalSubmit'].currentValue){
        this.onSubmit()
      }
  }
  getFileOrigins() {
    this.fileOrigin = [];
    this.fileOrigin = [
      { label: 'Local', value: 'ADDR_L' },
      { label: 'Foreign', value: 'ADDR_F' },
    ];
    this.advisoryFile.LocalForeign = 'ADDR_L';
    this.advisoryFile.LocalOrForeign = 'ADDR_L';
    this.getLocalAgencyTypes();
  }
  getSecurityClassifications(){
    this.secClassification = [];
    let response = {
      "CodeTables":[{"CodeTables-id":{"Id":"387436","ItemId":"002248573547A1ECA03AED61BD366817.387436"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":null,"I_TB_ParentCode":null,"Code":"EAT_BFRIPO","Name":"BFR IP Outcome","Category":"EXTERNAL_AGENCY_TYPE","Status":"A","CodeId":"1216","Title":{"Value":"CODE-000028337","@xmlns":"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0","@xmlns:wstxns3":"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0"},"@xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","@xmlns:wstxns1":"http://schemas/AGCSIWMasterData/CodeTables/operations","@xmlns":"http://schemas/AGCSIWMasterData/CodeTables","@xmlns:wstxns2":"http://schemas/AGCSIWMasterData/CodeTables"},{"CodeTables-id":{"Id":"387437","ItemId":"002248573547A1ECA03AED61BD366817.387437"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":null,"I_TB_ParentCode":null,"Code":"EAT_BC","Name":"Board/ Council","Category":"EXTERNAL_AGENCY_TYPE","Status":"A","CodeId":"1217","Title":{"Value":"CODE-000028338","@xmlns":"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0","@xmlns:wstxns5":"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0"},"@xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","@xmlns:wstxns1":"http://schemas/AGCSIWMasterData/CodeTables/operations","@xmlns":"http://schemas/AGCSIWMasterData/CodeTables","@xmlns:wstxns4":"http://schemas/AGCSIWMasterData/CodeTables"},{"CodeTables-id":{"Id":"387438","ItemId":"002248573547A1ECA03AED61BD366817.387438"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":null,"I_TB_ParentCode":null,"Code":"EAT_CO","Name":"Country","Category":"EXTERNAL_AGENCY_TYPE","Status":"A","CodeId":"1218","Title":{"Value":"CODE-000028339","@xmlns":"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0","@xmlns:wstxns7":"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0"},"@xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","@xmlns:wstxns1":"http://schemas/AGCSIWMasterData/CodeTables/operations","@xmlns":"http://schemas/AGCSIWMasterData/CodeTables","@xmlns:wstxns6":"http://schemas/AGCSIWMasterData/CodeTables"},{"CodeTables-id":{"Id":"387439","ItemId":"002248573547A1ECA03AED61BD366817.387439"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":null,"I_TB_ParentCode":null,"Code":"EAT_EA","Name":"Enforcement Agency","Category":"EXTERNAL_AGENCY_TYPE","Status":"A","CodeId":"1219","Title":{"Value":"CODE-000028340","@xmlns":"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0","@xmlns:wstxns9":"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0"},"@xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","@xmlns:wstxns1":"http://schemas/AGCSIWMasterData/CodeTables/operations","@xmlns":"http://schemas/AGCSIWMasterData/CodeTables","@xmlns:wstxns8":"http://schemas/AGCSIWMasterData/CodeTables"},{"CodeTables-id":{"Id":"387440","ItemId":"002248573547A1ECA03AED61BD366817.387440"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":null,"I_TB_ParentCode":null,"Code":"EAT_GM","Name":"Government Ministry","Category":"EXTERNAL_AGENCY_TYPE","Status":"A","CodeId":"1220","Title":{"Value":"CODE-000028341","@xmlns":"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0","@xmlns:wstxns11":"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0"},"@xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","@xmlns:wstxns1":"http://schemas/AGCSIWMasterData/CodeTables/operations","@xmlns":"http://schemas/AGCSIWMasterData/CodeTables","@xmlns:wstxns10":"http://schemas/AGCSIWMasterData/CodeTables"},{"CodeTables-id":{"Id":"387441","ItemId":"002248573547A1ECA03AED61BD366817.387441"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":null,"I_TB_ParentCode":null,"Code":"EAT_H","Name":"Hospital","Category":"EXTERNAL_AGENCY_TYPE","Status":"A","CodeId":"1221","Title":{"Value":"CODE-000028342","@xmlns":"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0","@xmlns:wstxns13":"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0"},"@xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","@xmlns:wstxns1":"http://schemas/AGCSIWMasterData/CodeTables/operations","@xmlns":"http://schemas/AGCSIWMasterData/CodeTables","@xmlns:wstxns12":"http://schemas/AGCSIWMasterData/CodeTables"},{"CodeTables-id":{"Id":"387442","ItemId":"002248573547A1ECA03AED61BD366817.387442"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":null,"I_TB_ParentCode":null,"Code":"EAT_ID","Name":"Internal Division","Category":"EXTERNAL_AGENCY_TYPE","Status":"A","CodeId":"1222","Title":{"Value":"CODE-000028343","@xmlns":"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0","@xmlns:wstxns15":"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0"},"@xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","@xmlns:wstxns1":"http://schemas/AGCSIWMasterData/CodeTables/operations","@xmlns":"http://schemas/AGCSIWMasterData/CodeTables","@xmlns:wstxns14":"http://schemas/AGCSIWMasterData/CodeTables"},{"CodeTables-id":{"Id":"387443","ItemId":"002248573547A1ECA03AED61BD366817.387443"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":null,"I_TB_ParentCode":null,"Code":"EAT_LFAE","Name":"Law Firm (A-E)","Category":"EXTERNAL_AGENCY_TYPE","Status":"A","CodeId":"1223","Title":{"Value":"CODE-000028344","@xmlns":"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0","@xmlns:wstxns17":"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0"},"@xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","@xmlns:wstxns1":"http://schemas/AGCSIWMasterData/CodeTables/operations","@xmlns":"http://schemas/AGCSIWMasterData/CodeTables","@xmlns:wstxns16":"http://schemas/AGCSIWMasterData/CodeTables"},{"CodeTables-id":{"Id":"387444","ItemId":"002248573547A1ECA03AED61BD366817.387444"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":null,"I_TB_ParentCode":null,"Code":"EAT_LFFK","Name":"Law Firm (F-K)","Category":"EXTERNAL_AGENCY_TYPE","Status":"A","CodeId":"1224","Title":{"Value":"CODE-000028345","@xmlns":"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0","@xmlns:wstxns19":"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0"},"@xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","@xmlns:wstxns1":"http://schemas/AGCSIWMasterData/CodeTables/operations","@xmlns":"http://schemas/AGCSIWMasterData/CodeTables","@xmlns:wstxns18":"http://schemas/AGCSIWMasterData/CodeTables"},{"CodeTables-id":{"Id":"387445","ItemId":"002248573547A1ECA03AED61BD366817.387445"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":null,"I_TB_ParentCode":null,"Code":"EAT_LFLR","Name":"Law Firm (L-R)","Category":"EXTERNAL_AGENCY_TYPE","Status":"A","CodeId":"1225","Title":{"Value":"CODE-000028346","@xmlns":"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0","@xmlns:wstxns21":"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0"},"@xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","@xmlns:wstxns1":"http://schemas/AGCSIWMasterData/CodeTables/operations","@xmlns":"http://schemas/AGCSIWMasterData/CodeTables","@xmlns:wstxns20":"http://schemas/AGCSIWMasterData/CodeTables"},{"CodeTables-id":{"Id":"387446","ItemId":"002248573547A1ECA03AED61BD366817.387446"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":null,"I_TB_ParentCode":null,"Code":"EAT_LFSZ","Name":"Law Firm (S-Z)","Category":"EXTERNAL_AGENCY_TYPE","Status":"A","CodeId":"1226","Title":{"Value":"CODE-000028347","@xmlns":"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0","@xmlns:wstxns23":"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0"},"@xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","@xmlns:wstxns1":"http://schemas/AGCSIWMasterData/CodeTables/operations","@xmlns":"http://schemas/AGCSIWMasterData/CodeTables","@xmlns:wstxns22":"http://schemas/AGCSIWMasterData/CodeTables"},{"CodeTables-id":{"Id":"387447","ItemId":"002248573547A1ECA03AED61BD366817.387447"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":null,"I_TB_ParentCode":null,"Code":"EAT_MP","Name":"Member of Parliament","Category":"EXTERNAL_AGENCY_TYPE","Status":"A","CodeId":"1227","Title":{"Value":"CODE-000028348","@xmlns":"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0","@xmlns:wstxns25":"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0"},"@xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","@xmlns:wstxns1":"http://schemas/AGCSIWMasterData/CodeTables/operations","@xmlns":"http://schemas/AGCSIWMasterData/CodeTables","@xmlns:wstxns24":"http://schemas/AGCSIWMasterData/CodeTables"},{"CodeTables-id":{"Id":"387448","ItemId":"002248573547A1ECA03AED61BD366817.387448"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":null,"I_TB_ParentCode":null,"Code":"EAT_MPU","Name":"Member of Public","Category":"EXTERNAL_AGENCY_TYPE","Status":"A","CodeId":"1228","Title":{"Value":"CODE-000028349","@xmlns":"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0","@xmlns:wstxns27":"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0"},"@xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","@xmlns:wstxns1":"http://schemas/AGCSIWMasterData/CodeTables/operations","@xmlns":"http://schemas/AGCSIWMasterData/CodeTables","@xmlns:wstxns26":"http://schemas/AGCSIWMasterData/CodeTables"},{"CodeTables-id":{"Id":"387449","ItemId":"002248573547A1ECA03AED61BD366817.387449"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":null,"I_TB_ParentCode":null,"Code":"EAT_OS","Name":"Organ of State","Category":"EXTERNAL_AGENCY_TYPE","Status":"A","CodeId":"1229","Title":{"Value":"CODE-000028350","@xmlns":"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0","@xmlns:wstxns29":"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0"},"@xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","@xmlns:wstxns1":"http://schemas/AGCSIWMasterData/CodeTables/operations","@xmlns":"http://schemas/AGCSIWMasterData/CodeTables","@xmlns:wstxns28":"http://schemas/AGCSIWMasterData/CodeTables"},{"CodeTables-id":{"Id":"387453","ItemId":"002248573547A1ECA03AED61BD366817.387453"},"DisplayOrder":"99","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":null,"I_TB_ParentCode":null,"Code":"EAT_O","Name":"Others","Category":"EXTERNAL_AGENCY_TYPE","Status":"A","CodeId":"1233","Title":{"Value":"CODE-000028354","@xmlns":"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0","@xmlns:wstxns31":"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0"},"@xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","@xmlns:wstxns1":"http://schemas/AGCSIWMasterData/CodeTables/operations","@xmlns":"http://schemas/AGCSIWMasterData/CodeTables","@xmlns:wstxns30":"http://schemas/AGCSIWMasterData/CodeTables"},{"CodeTables-id":{"Id":"387450","ItemId":"002248573547A1ECA03AED61BD366817.387450"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":null,"I_TB_ParentCode":null,"Code":"EAT_RO","Name":"Representation Outcome","Category":"EXTERNAL_AGENCY_TYPE","Status":"A","CodeId":"1230","Title":{"Value":"CODE-000028351","@xmlns":"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0","@xmlns:wstxns33":"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0"},"@xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","@xmlns:wstxns1":"http://schemas/AGCSIWMasterData/CodeTables/operations","@xmlns":"http://schemas/AGCSIWMasterData/CodeTables","@xmlns:wstxns32":"http://schemas/AGCSIWMasterData/CodeTables"},{"CodeTables-id":{"Id":"387451","ItemId":"002248573547A1ECA03AED61BD366817.387451"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":null,"I_TB_ParentCode":null,"Code":"EAT_S","Name":"School","Category":"EXTERNAL_AGENCY_TYPE","Status":"A","CodeId":"1231","Title":{"Value":"CODE-000028352","@xmlns":"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0","@xmlns:wstxns35":"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0"},"@xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","@xmlns:wstxns1":"http://schemas/AGCSIWMasterData/CodeTables/operations","@xmlns":"http://schemas/AGCSIWMasterData/CodeTables","@xmlns:wstxns34":"http://schemas/AGCSIWMasterData/CodeTables"},{"CodeTables-id":{"Id":"387452","ItemId":"002248573547A1ECA03AED61BD366817.387452"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":null,"I_TB_ParentCode":null,"Code":"EAT_SB","Name":"Statutory Board","Category":"EXTERNAL_AGENCY_TYPE","Status":"A","CodeId":"1232","Title":{"Value":"CODE-000028353","@xmlns":"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0","@xmlns:wstxns37":"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0"},"@xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","@xmlns:wstxns1":"http://schemas/AGCSIWMasterData/CodeTables/operations","@xmlns":"http://schemas/AGCSIWMasterData/CodeTables","@xmlns:wstxns36":"http://schemas/AGCSIWMasterData/CodeTables"}],"@xmlns:wstxns1":"http://schemas/AGCSIWMasterData/CodeTables/operations","@xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance"
    }
    this.getMasterDataSuccessHandler(response,'SECURITY_CLASSIFICATION')
  }
  getAGItemID() {
    let response = {"FileRefNoFormat":{"ChildType":"V_PS_CM_DIVISION","MetadataCategory":null,"I_IW_ParentId":null,"WorkOnMatterIndicator":"N","I_RefNoDN":null,"IsMigrated":null,"I_ParentItemID":null,"I_IW_ID":"1","Status":"A","I_ChildDescription":null,"I_FileType":null,"FormatID":"100001","I_ChildType":"CUSTOM","BFRComplexity":null,"RetentionPeriodType":null,"Description":"Attorney-General","ReferenceNoDN":"AG","I_ChildCode":null,"FileType":null,"RetentionPeriodValue":null,"Code":"AG","FileRefNoFormat-id":{"Id":"294915","ItemId":"002248573547A1ECA330FA604440E819.294915"},"Title":{"Value":"AG","@xmlns":"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0","@xmlns:wstxns3":"http://schemas.opentext.com/entitymodeling/buildingblocks/title/1.0"},"@xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","@xmlns:wstxns1":"http://schemas/AGCSIWMasterData/FileRefNoFormat/operations","@xmlns":"http://schemas/AGCSIWMasterData/FileRefNoFormat","@xmlns:wstxns2":"http://schemas/AGCSIWMasterData/FileRefNoFormat"},"@xmlns:wstxns1":"http://schemas/AGCSIWMasterData/FileRefNoFormat/operations","@xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance"}
    let resp = response.FileRefNoFormat
    if (resp) {
      this.getFileDivisions(resp['FileRefNoFormat-id']['ItemId'])
    }
  }
  getFileDivisions(agItemID: string) {
    this.allFileDivisions = [];
    let response = {"FileRefNoFormat":[{"ParentCode":{"FileRefNoFormat-id":{"Id":"294915","ItemId":"002248573547A1ECA330FA604440E819.294915"}},"Title":{"Value":"ADM"},"ChildType":"CUSTOM","MetadataCategory":null,"I_IW_ParentId":"1","WorkOnMatterIndicator":"N","I_RefNoDN":null,"IsMigrated":null,"I_ParentItemID":null,"I_IW_ID":"10","Status":"I","I_ChildDescription":null,"I_FileType":null,"FormatID":"100002","I_ChildType":"CUSTOM","BFRComplexity":null,"RetentionPeriodType":null,"Description":"ADM","ReferenceNoDN":"AG/ADM","I_ChildCode":null,"FileType":null,"RetentionPeriodValue":null,"Code":"ADM","FileRefNoFormat-id":{"Id":"294913","ItemId":"002248573547A1ECA330FA604440E819.294913"}},{"ParentCode":{"FileRefNoFormat-id":{"Id":"294915","ItemId":"002248573547A1ECA330FA604440E819.294915"}},"Title":{"Value":"FTCD"},"ChildType":"CUSTOM","MetadataCategory":null,"I_IW_ParentId":"1","WorkOnMatterIndicator":"N","I_RefNoDN":null,"IsMigrated":null,"I_ParentItemID":null,"I_IW_ID":"5","Status":"A","I_ChildDescription":null,"I_FileType":null,"FormatID":"2479","I_ChildType":"CUSTOM","BFRComplexity":null,"RetentionPeriodType":null,"Description":"Financial and Technology Crime Division","ReferenceNoDN":"AG/FTCD","I_ChildCode":null,"FileType":null,"RetentionPeriodValue":null,"Code":"FTCD","FileRefNoFormat-id":{"Id":"294914","ItemId":"002248573547A1ECA330FA604440E819.294914"}},{"ParentCode":{"FileRefNoFormat-id":{"Id":"294915","ItemId":"002248573547A1ECA330FA604440E819.294915"}},"Title":{"Value":"CJFS"},"ChildType":"CUSTOM","MetadataCategory":null,"I_IW_ParentId":"1","WorkOnMatterIndicator":"N","I_RefNoDN":null,"IsMigrated":null,"I_ParentItemID":null,"I_IW_ID":"15","Status":"I","I_ChildDescription":null,"I_FileType":null,"FormatID":"102324","I_ChildType":"CUSTOM","BFRComplexity":null,"RetentionPeriodType":null,"Description":"CJFS","ReferenceNoDN":"AG/CJFS","I_ChildCode":null,"FileType":null,"RetentionPeriodValue":null,"Code":"CJFS","FileRefNoFormat-id":{"Id":"294916","ItemId":"002248573547A1ECA330FA604440E819.294916"}},{"ParentCode":{"FileRefNoFormat-id":{"Id":"294915","ItemId":"002248573547A1ECA330FA604440E819.294915"}},"Title":{"Value":"LPS"},"ChildType":"CUSTOM","MetadataCategory":null,"I_IW_ParentId":"1","WorkOnMatterIndicator":"N","I_RefNoDN":null,"IsMigrated":null,"I_ParentItemID":null,"I_IW_ID":"2","Status":"A","I_ChildDescription":null,"I_FileType":null,"FormatID":"1308","I_ChildType":"CUSTOM","BFRComplexity":null,"RetentionPeriodType":null,"Description":"LPS","ReferenceNoDN":"AG/LPS","I_ChildCode":null,"FileType":null,"RetentionPeriodValue":null,"Code":"LPS","FileRefNoFormat-id":{"Id":"294917","ItemId":"002248573547A1ECA330FA604440E819.294917"}},{"ParentCode":{"FileRefNoFormat-id":{"Id":"294915","ItemId":"002248573547A1ECA330FA604440E819.294915"}},"Title":{"Value":"CJGO"},"ChildType":"CUSTOM","MetadataCategory":null,"I_IW_ParentId":"1","WorkOnMatterIndicator":"N","I_RefNoDN":null,"IsMigrated":null,"I_ParentItemID":null,"I_IW_ID":"16","Status":"I","I_ChildDescription":null,"I_FileType":null,"FormatID":"102348","I_ChildType":"CUSTOM","BFRComplexity":null,"RetentionPeriodType":null,"Description":"CJGO","ReferenceNoDN":"AG/CJGO","I_ChildCode":null,"FileType":null,"RetentionPeriodValue":null,"Code":"CJGO","FileRefNoFormat-id":{"Id":"294918","ItemId":"002248573547A1ECA330FA604440E819.294918"}},{"ParentCode":{"FileRefNoFormat-id":{"Id":"294915","ItemId":"002248573547A1ECA330FA604440E819.294915"}},"Title":{"Value":"LEGIS"},"ChildType":"CUSTOM","MetadataCategory":null,"I_IW_ParentId":"1","WorkOnMatterIndicator":"N","I_RefNoDN":null,"IsMigrated":null,"I_ParentItemID":null,"I_IW_ID":"6","Status":"A","I_ChildDescription":null,"I_FileType":null,"FormatID":"2480","I_ChildType":"CUSTOM","BFRComplexity":null,"RetentionPeriodType":null,"Description":"Legislation","ReferenceNoDN":"AG/LEGIS","I_ChildCode":null,"FileType":null,"RetentionPeriodValue":null,"Code":"LEGIS","FileRefNoFormat-id":{"Id":"294919","ItemId":"002248573547A1ECA330FA604440E819.294919"}}]}
    this.getChildEntriesSuccessHandler(response,'DIVISION')
  }
  getCurrentUserFileDivisions() {
    this.fileDivisions = [];
    let response = {"Groups":{"FunctionalGroup":{"FunctionalGroup-id":{"Id":"49155","ItemId":"002248573547A1ECA0C26352C534A817.49155"},"GroupName":"IAD","GroupCreatedInOTDS":"Yes","IsDivision":"true","IsChild":"No","GroupDescription":"International Affairs Division","GroupType":"Functional","UserLinkedToGroup":{"@nil":"true"},"Status":"A","Title":{"Value":"IAD"}}}}
    if (response.Groups) {
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
          if (resp.FileType && resp.FileType == "Advisory") {
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
            if (child.FileType && child.FileType == "Advisory") {
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
    let response = {"FileRefNoFormat":[{"ParentCode":{"FileRefNoFormat-id":{"Id":"294936","ItemId":"002248573547A1ECA330FA604440E819.294936"}},"Title":{"Value":"ADM-S"},"ChildType":"YEAR","MetadataCategory":null,"I_IW_ParentId":"22","WorkOnMatterIndicator":"N","I_RefNoDN":null,"IsMigrated":null,"I_ParentItemID":null,"I_IW_ID":"360","Status":"A","I_ChildDescription":null,"I_FileType":null,"FormatID":"103096","I_ChildType":"CUSTOM","BFRComplexity":null,"RetentionPeriodType":null,"Description":"IAD ADMINISTRATION","ReferenceNoDN":"AG/IAD/ADM-S","I_ChildCode":null,"FileType":"Generic","RetentionPeriodValue":null,"Code":"ADM-S","FileRefNoFormat-id":{"Id":"295266","ItemId":"002248573547A1ECA330FA604440E819.295266"}},{"ParentCode":{"FileRefNoFormat-id":{"Id":"294936","ItemId":"002248573547A1ECA330FA604440E819.294936"}},"Title":{"Value":"AIR"},"ChildType":"CUSTOM","MetadataCategory":"ADVICE","I_IW_ParentId":"22","WorkOnMatterIndicator":"Y","I_RefNoDN":null,"IsMigrated":null,"I_ParentItemID":null,"I_IW_ID":"361","Status":"A","I_ChildDescription":null,"I_FileType":null,"FormatID":"103098","I_ChildType":"CUSTOM","BFRComplexity":null,"RetentionPeriodType":null,"Description":"AVIATION AND SPACE MATTERS","ReferenceNoDN":"AG/IAD/AIR","I_ChildCode":null,"FileType":"Advisory","RetentionPeriodValue":null,"Code":"AIR","FileRefNoFormat-id":{"Id":"295269","ItemId":"002248573547A1ECA330FA604440E819.295269"}},{"ParentCode":{"FileRefNoFormat-id":{"Id":"294936","ItemId":"002248573547A1ECA330FA604440E819.294936"}},"Title":{"Value":"ADM"},"ChildType":"CUSTOM","MetadataCategory":null,"I_IW_ParentId":"22","WorkOnMatterIndicator":"N","I_RefNoDN":null,"IsMigrated":null,"I_ParentItemID":null,"I_IW_ID":"358","Status":"A","I_ChildDescription":null,"I_FileType":null,"FormatID":"103078","I_ChildType":"CUSTOM","BFRComplexity":"2","RetentionPeriodType":null,"Description":"IAD ADMINISTRATION","ReferenceNoDN":"AG/IAD/ADM","I_ChildCode":null,"FileType":"Generic","RetentionPeriodValue":"0","Code":"ADM","FileRefNoFormat-id":{"Id":"295270","ItemId":"002248573547A1ECA330FA604440E819.295270"}},{"ParentCode":{"FileRefNoFormat-id":{"Id":"294936","ItemId":"002248573547A1ECA330FA604440E819.294936"}},"Title":{"Value":"AIR-C"},"ChildType":"CUSTOM","MetadataCategory":null,"I_IW_ParentId":"22","WorkOnMatterIndicator":"N","I_RefNoDN":null,"IsMigrated":null,"I_ParentItemID":null,"I_IW_ID":"362","Status":"A","I_ChildDescription":null,"I_FileType":null,"FormatID":"103103","I_ChildType":"CUSTOM","BFRComplexity":null,"RetentionPeriodType":null,"Description":"AVIATION AND SPACE MATTERS","ReferenceNoDN":"AG/IAD/AIR-C","I_ChildCode":null,"FileType":"Advisory","RetentionPeriodValue":null,"Code":"AIR-C","FileRefNoFormat-id":{"Id":"295273","ItemId":"002248573547A1ECA330FA604440E819.295273"}},{"ParentCode":{"FileRefNoFormat-id":{"Id":"294936","ItemId":"002248573547A1ECA330FA604440E819.294936"}},"Title":{"Value":"ADM-C"},"ChildType":"YEAR","MetadataCategory":null,"I_IW_ParentId":"22","WorkOnMatterIndicator":"N","I_RefNoDN":null,"IsMigrated":null,"I_ParentItemID":null,"I_IW_ID":"359","Status":"A","I_ChildDescription":null,"I_FileType":null,"FormatID":"103093","I_ChildType":"CUSTOM","BFRComplexity":null,"RetentionPeriodType":null,"Description":"IAD ADMINISTRATION","ReferenceNoDN":"AG/IAD/ADM-C","I_ChildCode":null,"FileType":"Generic","RetentionPeriodValue":null,"Code":"ADM-C","FileRefNoFormat-id":{"Id":"295274","ItemId":"002248573547A1ECA330FA604440E819.295274"}}]}
    this.getChildEntriesSuccessHandler(response,'HEADER1');
  }
  getFileHeader2(header1ItemID: string) {
    this.header2 = []
    let response = {"FileRefNoFormat":[{"ParentCode":{"FileRefNoFormat-id":{"Id":"295269","ItemId":"002248573547A1ECA330FA604440E819.295269"}},"Title":{"Value":"1"},"ChildType":"YEAR","MetadataCategory":null,"I_IW_ParentId":"361","WorkOnMatterIndicator":"N","I_RefNoDN":null,"IsMigrated":null,"I_ParentItemID":null,"I_IW_ID":"10781","Status":"A","I_ChildDescription":null,"I_FileType":null,"FormatID":"103099","I_ChildType":"CUSTOM","BFRComplexity":null,"RetentionPeriodType":null,"Description":"1","ReferenceNoDN":"AG/IAD/AIR/1","I_ChildCode":null,"FileType":null,"RetentionPeriodValue":null,"Code":"1","FileRefNoFormat-id":{"Id":"305690","ItemId":"002248573547A1ECA330FA604440E819.305690"}},{"ParentCode":{"FileRefNoFormat-id":{"Id":"295269","ItemId":"002248573547A1ECA330FA604440E819.295269"}},"Title":{"Value":"2"},"ChildType":"YEAR","MetadataCategory":null,"I_IW_ParentId":"361","WorkOnMatterIndicator":"N","I_RefNoDN":null,"IsMigrated":null,"I_ParentItemID":null,"I_IW_ID":"10782","Status":"A","I_ChildDescription":null,"I_FileType":null,"FormatID":"103100","I_ChildType":"CUSTOM","BFRComplexity":null,"RetentionPeriodType":null,"Description":"2","ReferenceNoDN":"AG/IAD/AIR/2","I_ChildCode":null,"FileType":null,"RetentionPeriodValue":null,"Code":"2","FileRefNoFormat-id":{"Id":"305693","ItemId":"002248573547A1ECA330FA604440E819.305693"}},{"ParentCode":{"FileRefNoFormat-id":{"Id":"295269","ItemId":"002248573547A1ECA330FA604440E819.295269"}},"Title":{"Value":"FIRS"},"ChildType":"YEAR","MetadataCategory":null,"I_IW_ParentId":"361","WorkOnMatterIndicator":"N","I_RefNoDN":null,"IsMigrated":null,"I_ParentItemID":null,"I_IW_ID":"10783","Status":"A","I_ChildDescription":null,"I_FileType":null,"FormatID":"103101","I_ChildType":"CUSTOM","BFRComplexity":null,"RetentionPeriodType":null,"Description":"FIRS","ReferenceNoDN":"AG/IAD/AIR/FIRS","I_ChildCode":null,"FileType":null,"RetentionPeriodValue":null,"Code":"FIRS","FileRefNoFormat-id":{"Id":"305696","ItemId":"002248573547A1ECA330FA604440E819.305696"}},{"ParentCode":{"FileRefNoFormat-id":{"Id":"295269","ItemId":"002248573547A1ECA330FA604440E819.295269"}},"Title":{"Value":"TRAF"},"ChildType":"YEAR","MetadataCategory":null,"I_IW_ParentId":"361","WorkOnMatterIndicator":"N","I_RefNoDN":null,"IsMigrated":null,"I_ParentItemID":null,"I_IW_ID":"10784","Status":"A","I_ChildDescription":null,"I_FileType":null,"FormatID":"103102","I_ChildType":"CUSTOM","BFRComplexity":null,"RetentionPeriodType":null,"Description":"Traffic","ReferenceNoDN":"AG/IAD/AIR/TRAF","I_ChildCode":null,"FileType":null,"RetentionPeriodValue":null,"Code":"TRAF","FileRefNoFormat-id":{"Id":"305700","ItemId":"002248573547A1ECA330FA604440E819.305700"}}]}
    this.getChildEntriesSuccessHandler(response,'HEADER2');
  }
  getFileYear() {
    this.year = []
    let response = {"CodeTables":{"CodeTables-id":{"Id":"390867","ItemId":"002248573547A1ECA03AED61BD366817.390867"},"DisplayOrder":"1","IsMigrated":"false","I_TB_ParentID":null,"AlternateKey":null,"I_TB_ParentCode":null,"Code":"FILE_YEAR","Name":"50","Category":"FILE_YEAR","Status":"A","CodeId":"4489","Title":{"Value":"CODE-000031768"}}}
    this.getMasterDataSuccessHandler(response,'FILE_YEAR')
  }
  getLocalAgencyTypes() {
    this.localAgencyTypes = [];
    let response = {"CodeTables":[{"CodeTables-id":{"Id":"389463","ItemId":"002248573547A1ECA03AED61BD366817.389463"},"DisplayOrder":"2","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"C","I_TB_ParentCode":null,"Code":"SCLASS_C","Name":"Confidential","Category":"SECURITY_CLASSIFICATION","Status":"A","CodeId":"3149","Title":{"Value":"CODE-000030364"}},{"CodeTables-id":{"Id":"389464","ItemId":"002248573547A1ECA03AED61BD366817.389464"},"DisplayOrder":"3","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"R","I_TB_ParentCode":null,"Code":"SCLASS_R","Name":"Restricted","Category":"SECURITY_CLASSIFICATION","Status":"A","CodeId":"3150","Title":{"Value":"CODE-000030365"}},{"CodeTables-id":{"Id":"389462","ItemId":"002248573547A1ECA03AED61BD366817.389462"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"S","I_TB_ParentCode":null,"Code":"SCLASS_S","Name":"Secret","Category":"SECURITY_CLASSIFICATION","Status":"A","CodeId":"3148","Title":{"Value":"CODE-000030363"}}]}
    this.getMasterDataSuccessHandler(response,'EXTERNAL_AGENCY_TYPE')
  }
  getFileOwners() {
    this.fileOwners = [];
    let response = {"UserACL":[{"AppUser":{"Person-id":{"Id":"163856385","ItemId":"F8B156B4FF8F11E6E6562305FE2BDF32.163856385"}},"UserACL-id":{"Id":"442724","ItemId":"002248573547A1ECAB95FB80B869281B.442724"},"DisplayName":"Priya","ACLRole":null,"GroupName":"AGC","ACLRolePackage":null,"UserItemId":"F8B156B4FF8F11E6E6562305FE2BDF32.163856385","UserDisplayName":"priya"},{"AppUser":{"Person-id":{"Id":"163856386","ItemId":"F8B156B4FF8F11E6E6562305FE2BDF32.163856386"}},"UserACL-id":{"Id":"442725","ItemId":"002248573547A1ECAB95FB80B869281B.442725"},"DisplayName":"Demo User 2","ACLRole":null,"GroupName":"AGC","ACLRolePackage":null,"UserItemId":"F8B156B4FF8F11E6E6562305FE2BDF32.163856386","UserDisplayName":"Demo User 2"}]}
    if (response.UserACL) {
      if (response.UserACL.length > 0) {
        response.UserACL.forEach((data: any) => {
          this.fileOwners.push({ label: data.UserDisplayName, value: data.UserDisplayName })
        })
      }
    }
  }
  getForeignCountries() {
    this.foreignCountries = [];
    let response = {"CodeTables":[{"CodeTables-id":{"Id":"386568","ItemId":"002248573547A1ECA03AED61BD366817.386568"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"AF","I_TB_ParentCode":null,"Code":"CTRY_AF","Name":"AFGHANISTAN","Category":"COUNTRY","Status":"A","CodeId":"366","Title":{"Value":"CODE-000027469"}},{"CodeTables-id":{"Id":"386569","ItemId":"002248573547A1ECA03AED61BD366817.386569"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"AX","I_TB_ParentCode":null,"Code":"CTRY_AX","Name":"ALAND ISLANDS","Category":"COUNTRY","Status":"A","CodeId":"367","Title":{"Value":"CODE-000027470"}},{"CodeTables-id":{"Id":"386570","ItemId":"002248573547A1ECA03AED61BD366817.386570"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"AL","I_TB_ParentCode":null,"Code":"CTRY_AL","Name":"ALBANIA","Category":"COUNTRY","Status":"A","CodeId":"368","Title":{"Value":"CODE-000027471"}},{"CodeTables-id":{"Id":"386571","ItemId":"002248573547A1ECA03AED61BD366817.386571"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"DZ","I_TB_ParentCode":null,"Code":"CTRY_DZ","Name":"ALGERIA","Category":"COUNTRY","Status":"A","CodeId":"369","Title":{"Value":"CODE-000027472"}},{"CodeTables-id":{"Id":"386572","ItemId":"002248573547A1ECA03AED61BD366817.386572"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":null,"AlternateKey":"AS","I_TB_ParentCode":null,"Code":"CTRY_AS","Name":"AMERICAN SAMOA","Category":"COUNTRY","Status":"A","CodeId":"370","Title":{"Value":"CODE-000027473"}}]}
    this.getMasterDataSuccessHandler(response,'COUNTRY')
  }
  getForeignAgencyTypes(countryCodeID: any) {
    this.foreignAgencyTypes = [];
    this.foreignAgencyNames = [];
    let response = {"CodeTables":[{"CodeTables-id":{"Id":"389913","ItemId":"002248573547A1ECA03AED61BD366817.389913"},"DisplayOrder":"1","IsMigrated":"true","I_TB_ParentID":"379","AlternateKey":"AU","I_TB_ParentCode":"CTRY_AU","Code":"ATF_AUM","Name":"Ministry","Category":"AGENCY_TYPE_FOREIGN","Status":"A","CodeId":"3558","Title":{"Value":"CODE-000030814"}},{"CodeTables-id":{"Id":"389914","ItemId":"002248573547A1ECA03AED61BD366817.389914"},"DisplayOrder":"2","IsMigrated":"true","I_TB_ParentID":"379","AlternateKey":"AU","I_TB_ParentCode":"CTRY_AU","Code":"ATF_AUJ","Name":"Judiciary","Category":"AGENCY_TYPE_FOREIGN","Status":"A","CodeId":"3559","Title":{"Value":"CODE-000030815"}},{"CodeTables-id":{"Id":"389915","ItemId":"002248573547A1ECA03AED61BD366817.389915"},"DisplayOrder":"3","IsMigrated":"true","I_TB_ParentID":"379","AlternateKey":"AU","I_TB_ParentCode":"CTRY_AU","Code":"ATF_AULE","Name":"Law Enforcement","Category":"AGENCY_TYPE_FOREIGN","Status":"A","CodeId":"3560","Title":{"Value":"CODE-000030816"}}]}
    this.getMasterDataSuccessHandler(response,'AGENCY_TYPE_FOREIGN')
  }
  getMasterDataSuccessHandler(response:any,type: any) {
    if (response.CodeTables){
      if (response.CodeTables.length > 0) {
        if (type == 'SECURITY_CLASSIFICATION') {
          response.CodeTables.forEach((data: any) => {
            this.secClassification.push({ label: data.Name, value: data.Code })
          })
          this.advisoryFile.SecurityClassification = 'SCLASS_S';
        }
        if (type == 'EXTERNAL_AGENCY_TYPE') {
          response.CodeTables.forEach((data: any) => {
            this.localAgencyTypes.push({ label: data.Name, value: data.Code })
            this.localAgencyTypeCodeIDMap.set(data.Code, data.CodeId);
          })
        }
        if (type == 'COUNTRY') {
          response.CodeTables.forEach((data: any) => {
            this.foreignCountries.push({ label: data.Name, value: data.Code })
            this.foreignAgencyCountryCodeIDMap.set(data.Code, data.CodeId);
          })
        }
        if (type == 'AGENCY_TYPE_FOREIGN') {
          response.CodeTables.forEach((data: any) => {
            this.foreignAgencyTypes.push({ label: data.Name, value: data.Code })
            this.foreignAgencyTypeCodeIDMap.set(data.Code, data.CodeId);
          })
        }
      }
      else if (!response.CodeTables.length) {
        let data = response.CodeTables;
        if (type == 'SECURITY_CLASSIFICATION') {
          this.secClassification.push({ label: data.Name, value: data.Code })
          this.advisoryFile.SecurityClassification = 'SCLASS_S';
        }
        if (type == 'EXTERNAL_AGENCY_TYPE') {
          this.localAgencyTypes.push({ label: data.Name, value: data.Code })
          this.localAgencyTypeCodeIDMap.set(data.Code, data.CodeId);
        }
        if (type == 'COUNTRY') {
          this.foreignCountries.push({ label: data.Name, value: data.Code })
          this.foreignAgencyCountryCodeIDMap.set(data.Code, data.CodeId);
        }
        if (type == 'AGENCY_TYPE_FOREIGN') {
          this.foreignAgencyTypes.push({ label: data.Name, value: data.Code })
          this.foreignAgencyTypeCodeIDMap.set(data.Code, data.CodeId);
        }
        if (type == 'FILE_YEAR') {
          let noOfYears = data.Name;
          for(var i=0;i<noOfYears;i++){
            this.year.push({ label: Number((new Date()).getFullYear()) - Number(i), value: Number((new Date()).getFullYear()) - Number(i) })
          }
        }
      }
    }
    if (response.Agency) {
      if (response.Agency.length > 0) {
        if (type == 'EXTERNAL_AGENCY_NAME') {
          response.Agency.forEach((data: any) => {
            this.localAgencyNames.push({ label: data.Description, value: data.AgencyCode })
          })
        }
        if (type == 'AGENCY_NAME_FOREIGN') {
          response.Agency.forEach((data: any) => {
            this.foreignAgencyNames.push({ label: data.Description, value: data.AgencyCode })
          })
        }
      }
      else if (!response.Agency) {
        let data = response.Agency;
        if (type == 'EXTERNAL_AGENCY_NAME') {
          this.localAgencyNames.push({ label: data.Description, value: data.AgencyCode })
        }
        if (type == 'AGENCY_NAME_FOREIGN') {
          this.foreignAgencyNames.push({ label: data.Description, value: data.AgencyCode })
        }
      }
    }
  }
  onLocalForeignChange(data: any){
    if (data.value === 'ADDR_F'){
      this.showLocalAgencyDetails = false;
      this.showForeignAgencyDetails = true;
      this.getForeignCountries();
    } else{
      this.showLocalAgencyDetails = true;
      this.showForeignAgencyDetails = false;
      this.getLocalAgencyTypes();
    }
    this.advisoryFile.LocalOrForeign = data.value;
  }
  onForeignAgencyCountryChange(data: any) {
    this.getForeignAgencyTypes(this.foreignAgencyCountryCodeIDMap.get(data.value));
  }
  onLocalAgencyTypeChange(data: any){
    this.localAgencyNames = [];
    let response = {"Agency":[{"AgencyTypeCode":"EAT_EA","Description":"(OLD) CRIME REGISTRY 2","BuildingName":null,"BlockNo":null,"CountryCode":"CTRY_SG","IsMigrated":null,"AgencyCode":"CB","AddressTypeCode":"ADDR_L","UnitNo":null,"UnFormatAddress":null,"PostalCode":null,"I_TB_ID":"1219","TelephoneNo":null,"StreetName":null,"Status":"A","LevelNo":null,"I_Agency_ID":"45","Agency-id":{"Id":"73752","ItemId":"002248573547A1ECA3CADFEDA165A81A.73752"}},{"AgencyTypeCode":"EAT_EA","Description":"AGENCY ABC","BuildingName":null,"BlockNo":null,"CountryCode":null,"IsMigrated":null,"AgencyCode":"ABC","AddressTypeCode":"ADDR_L","UnitNo":null,"UnFormatAddress":null,"PostalCode":null,"I_TB_ID":"1219","TelephoneNo":null,"StreetName":null,"Status":"A","LevelNo":null,"I_Agency_ID":"46","Agency-id":{"Id":"73754","ItemId":"002248573547A1ECA3CADFEDA165A81A.73754"}},{"AgencyTypeCode":"EAT_EA","Description":"(OLD) ANTI VICE","BuildingName":null,"BlockNo":null,"CountryCode":"CTRY_SG","IsMigrated":null,"AgencyCode":"AVT","AddressTypeCode":"ADDR_L","UnitNo":null,"UnFormatAddress":null,"PostalCode":null,"I_TB_ID":"1219","TelephoneNo":null,"StreetName":null,"Status":"A","LevelNo":null,"I_Agency_ID":"42","Agency-id":{"Id":"73755","ItemId":"002248573547A1ECA3CADFEDA165A81A.73755"}},{"AgencyTypeCode":"EAT_EA","Description":"AIRPORT POLICE","BuildingName":null,"BlockNo":null,"CountryCode":"CTRY_SG","IsMigrated":null,"AgencyCode":"AP","AddressTypeCode":"ADDR_L","UnitNo":null,"UnFormatAddress":null,"PostalCode":null,"I_TB_ID":"1219","TelephoneNo":null,"StreetName":null,"Status":"A","LevelNo":null,"I_Agency_ID":"47","Agency-id":{"Id":"73757","ItemId":"002248573547A1ECA3CADFEDA165A81A.73757"}},{"AgencyTypeCode":"EAT_EA","Description":"CENTRAL POLICE DIVISION HEADQUARTERS","BuildingName":null,"BlockNo":null,"CountryCode":"CTRY_SG","IsMigrated":null,"AgencyCode":"A","AddressTypeCode":"ADDR_L","UnitNo":null,"UnFormatAddress":null,"PostalCode":null,"I_TB_ID":"1219","TelephoneNo":null,"StreetName":null,"Status":"A","LevelNo":null,"I_Agency_ID":"55","Agency-id":{"Id":"73758","ItemId":"002248573547A1ECA3CADFEDA165A81A.73758"}}]}
    this.getMasterDataSuccessHandler(response,'EXTERNAL_AGENCY_NAME')
  }
  onForeignAgencyTypeChange(data: any){
    this.foreignAgencyNames = [];
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
    this.getFileHeader2(header1ItemID);
  }
  onFileHeader2Change(data: any) {
    this.getFileYear();
  }
  onSubmit() {
    this.formSubmitted = true;
    if (this.advfileForm && !this.advfileForm.valid) {
      this.reqSubmit.emit({ status: 'FAILURE' });
      this.utilService.alert('error', 'Error', 'Please fill all mandatory details!!', false);
    } else {
      let reqDetails:any = _.cloneDeep(this.advisoryFile)
      reqDetails.Sensitivity = reqDetails.Sensitivity == 'Yes'? true: false
      reqDetails.FileCreatedBy = UtilityService.CURRENT_USER_NAME;
      reqDetails.FileCreatedDate = this.datePipe.transform(new Date(), "yyyy-MM-dd'T'hh:mm:ss"); 
    }
  }
}
