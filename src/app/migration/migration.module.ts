import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { PrimeNGModule } from "../commons/primeng.module";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgxDropzoneModule } from "ngx-dropzone";
import { HttpClientModule } from "@angular/common/http";
import { MigrationDashboardComponent } from "./migration-dashboard/migration-dashboard.component";
import { MigrationDataUploadComponent } from "./migration-data-upload/migration-data-upload.component";
import { FileReportComponent } from "./file-report/file-report.component";
import { IngestionReportComponent } from "./ingestion-report/ingestion-report.component";
import { MigConsolidatedReportComponent } from "./mig-consolidated-report/mig-consolidated-report.component";
import { MigrationReportComponent } from "./migration-report/migration-report.component";
import { RecordDataComponent } from "./record-data/record-data.component";
import { ValidationReportComponent } from "./validation-report/validation-report.component";
import { UtilityService } from "../commons/services/utilities.service";
import { CommonModule, DatePipe, HashLocationStrategy, LocationStrategy } from "@angular/common";
import { BsModalService } from "ngx-bootstrap/modal";
import { SIWMigrationService } from "../commons/services/migration.service";
import { ConfirmationService, MessageService } from "primeng/api";
import { AppService } from "../commons/services/app.service";
import { RouterModule, Routes } from "@angular/router";
import { BackButtonDisableModule } from "angular-disable-browser-back-button";

const routes: Routes = [{path: '', component: MigrationDashboardComponent}]

@NgModule({
    declarations: [
        MigrationDashboardComponent,
        MigrationDataUploadComponent,
        FileReportComponent,
        IngestionReportComponent,
        MigConsolidatedReportComponent,
        MigrationReportComponent,
        RecordDataComponent,
        ValidationReportComponent
    ],
    providers: [UtilityService, DatePipe, BsModalService, SIWMigrationService, ConfirmationService, MessageService, AppService,
        { provide: LocationStrategy, useClass: HashLocationStrategy }
    ],
    imports: [CommonModule, FormsModule, PrimeNGModule, NgxDropzoneModule, RouterModule.forChild(routes),
        BackButtonDisableModule.forRoot({
            preserveScroll: true
        })
    ],
    exports: [RouterModule],
    bootstrap: [MigrationDashboardComponent]
})

export class MigrationModule{

}