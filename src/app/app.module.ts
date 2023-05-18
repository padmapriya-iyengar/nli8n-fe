import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdvisoryFileComponent } from './advisory-file/advisory-file.component';
import { AdvisoryRequestComponent } from './advisory-request/advisory-request.component';
import { MlaFileComponent } from './mla-file/mla-file.component';
import { MlaRequestComponent } from './mla-request/mla-request.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotificationComponent } from './notification/notification.component';
import { RecallReassignComponent } from './recall-reassign/recall-reassign.component';
import { RequestReopenComponent } from './request-reopen/request-reopen.component';
import { RequestReassignComponent } from './request-reassign/request-reassign.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

import { PrimeNGModule } from './commons/primeng.module'
import { UtilityService } from './commons/utilities.service';
import { DatePipe, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { BsModalService } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LoginComponent } from './login/login.component';
import { DocumentUploadComponent } from './document-upload/document-upload.component';
import { DocumentDetailsComponent } from './document-details/document-details.component';
import { DocumentVersionsComponent } from './document-versions/document-versions.component';
import { MigrationDashboardComponent } from './migration-dashboard/migration-dashboard.component';
import { MigrationDataUploadComponent } from './migration-data-upload/migration-data-upload.component';
import { SIWMigrationService } from './commons/migration.service';
import { FileReportComponent } from './file-report/file-report.component';
import { IngestionReportComponent } from './ingestion-report/ingestion-report.component';
import { MigConsolidatedReportComponent } from './mig-consolidated-report/mig-consolidated-report.component';
import { MigrationReportComponent } from './migration-report/migration-report.component';
import { RecordDataComponent } from './record-data/record-data.component';
import { ValidationReportComponent } from './validation-report/validation-report.component';
import { AppService } from './commons/app.service';

@NgModule({
  declarations: [
    AppComponent,
    AdvisoryFileComponent,
    AdvisoryRequestComponent,
    MlaFileComponent,
    MlaRequestComponent,
    DashboardComponent,
    NotificationComponent,
    RecallReassignComponent,
    RequestReopenComponent,
    RequestReassignComponent,
    UserProfileComponent,
    LoginComponent,
    DocumentUploadComponent,
    DocumentDetailsComponent,
    DocumentVersionsComponent,
    MigrationDashboardComponent,
    MigrationDataUploadComponent,
    FileReportComponent,
    IngestionReportComponent,
    MigConsolidatedReportComponent,
    MigrationReportComponent,
    RecordDataComponent,
    ValidationReportComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PrimeNGModule,
    FormsModule,
    BrowserAnimationsModule,
    NgxDropzoneModule,
    HttpClientModule
  ],
  providers: [UtilityService, DatePipe, BsModalService, SIWMigrationService,
    { provide: LocationStrategy, useClass: HashLocationStrategy }, ConfirmationService, MessageService, AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
