import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdvisoryFileComponent } from './services/advisory-file/advisory-file.component';
import { AdvisoryRequestComponent } from './services/advisory-request/advisory-request.component';
import { MlaFileComponent } from './services/mla-file/mla-file.component';
import { MlaRequestComponent } from './services/mla-request/mla-request.component';
import { DashboardComponent } from './commons/components/dashboard/dashboard.component';
import { NotificationComponent } from './commons/components/notification/notification.component';
import { UserProfileComponent } from './commons/components/user-profile/user-profile.component';

import { PrimeNGModule } from './commons/primeng.module'
import { UtilityService } from './commons/services/utilities.service';
import { CommonModule, DatePipe, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { BsModalService } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LoginComponent } from './commons/components/login/login.component';
import { DocumentUploadComponent } from './commons/components/document-upload/document-upload.component';
import { DocumentDetailsComponent } from './commons/components/document-details/document-details.component';
import { DocumentVersionsComponent } from './commons/components/document-versions/document-versions.component';
import { AppService } from './commons/services/app.service';
import { FileTitleDirective } from './commons/directives/file-title.directive';
import { MigrationDashboardComponent } from './migration/migration-dashboard/migration-dashboard.component';
import { WebSocketService } from './commons/services/websocket.service';

@NgModule({
  declarations: [
    AppComponent,
    AdvisoryFileComponent,
    AdvisoryRequestComponent,
    MlaFileComponent,
    MlaRequestComponent,
    DashboardComponent,
    NotificationComponent,
    UserProfileComponent,
    LoginComponent,
    DocumentUploadComponent,
    DocumentDetailsComponent,
    DocumentVersionsComponent,
    FileTitleDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PrimeNGModule,
    FormsModule,
    BrowserAnimationsModule,
    NgxDropzoneModule,
    HttpClientModule,
    CommonModule
  ],
  providers: [UtilityService, DatePipe, BsModalService, ConfirmationService, MessageService, AppService, WebSocketService, 
    { provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }
