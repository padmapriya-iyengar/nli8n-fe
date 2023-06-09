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
import { UserProfileComponent } from './user-profile/user-profile.component';

import { PrimeNGModule } from './commons/primeng.module'
import { UtilityService } from './commons/utilities.service';
import { CommonModule, DatePipe, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { BsModalService } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LoginComponent } from './login/login.component';
import { DocumentUploadComponent } from './document-upload/document-upload.component';
import { DocumentDetailsComponent } from './document-details/document-details.component';
import { DocumentVersionsComponent } from './document-versions/document-versions.component';
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
    UserProfileComponent,
    LoginComponent,
    DocumentUploadComponent,
    DocumentDetailsComponent,
    DocumentVersionsComponent
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
  providers: [UtilityService, DatePipe, BsModalService, ConfirmationService, MessageService, AppService,
    { provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }
