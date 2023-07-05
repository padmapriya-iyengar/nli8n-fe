import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MigrationDashboardComponent } from './migration-dashboard.component';
import { UtilitiesService } from 'src/app/commons/services/utilities.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { PrimeNGModule } from 'src/app/commons/primeng.module';
import { MigConsolidatedReportComponent } from '../mig-consolidated-report/mig-consolidated-report.component';
import { MigrationService } from 'src/app/commons/services/migration.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('MigrationDashboardComponent', () => {
  let component: MigrationDashboardComponent;
  let fixture: ComponentFixture<MigrationDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MigrationDashboardComponent, MigConsolidatedReportComponent ],
      providers: [UtilitiesService, MessageService, DatePipe, ConfirmationService, MigrationService],
      imports: [PrimeNGModule, BrowserAnimationsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MigrationDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
