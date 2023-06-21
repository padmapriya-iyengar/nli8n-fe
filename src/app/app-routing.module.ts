import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './commons/components/dashboard/dashboard.component';
import { DocumentUploadComponent } from './commons/components/document-upload/document-upload.component';
import { LoginComponent } from './commons/components/login/login.component';
import { MigrationDashboardComponent } from './migration/migration-dashboard/migration-dashboard.component';
import { SignUpComponent } from './commons/components/sign-up/sign-up.component';

const routes: Routes = [
  { path: "dashboard", component: DashboardComponent },
  { path: "docUpload", component: DocumentUploadComponent },
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignUpComponent},
  { path: "migration", 
    loadChildren: () => import('./migration/migration.module').then(mod => mod.MigrationModule)
  },
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
