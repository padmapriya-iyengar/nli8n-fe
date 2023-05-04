import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DocumentUploadComponent } from './document-upload/document-upload.component';
import { LoginComponent } from './login/login.component';
import { MigrationDashboardComponent } from './migration-dashboard/migration-dashboard.component';

const routes: Routes = [
  { path: "dashboard", component: DashboardComponent },
  { path: "migration", component: MigrationDashboardComponent },
  { path: "docUpload", component: DocumentUploadComponent },
  { path: "login", component: LoginComponent },
  { path: '', redirectTo: "login", pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
    initialNavigation: 'disabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
