import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MigConsolidatedReportComponent } from './mig-consolidated-report.component';
import { UtilitiesService } from 'src/app/commons/services/utilities.service';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { MigrationService } from 'src/app/commons/services/migration.service';
import { PrimeNGModule } from 'src/app/commons/primeng.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('MigConsolidatedReportComponent', () => {
  let component: MigConsolidatedReportComponent;
  let fixture: ComponentFixture<MigConsolidatedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MigConsolidatedReportComponent ],
      providers: [UtilitiesService, MessageService, DatePipe, MigrationService],
      imports: [PrimeNGModule, BrowserAnimationsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MigConsolidatedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
