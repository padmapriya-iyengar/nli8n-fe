import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationReportComponent } from './validation-report.component';
import { UtilitiesService } from 'src/app/commons/services/utilities.service';
import { DatePipe } from '@angular/common';
import { MigrationService } from 'src/app/commons/services/migration.service';
import { PrimeNGModule } from 'src/app/commons/primeng.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsModalService } from 'ngx-bootstrap/modal';

describe('ValidationReportComponent', () => {
  let component: ValidationReportComponent;
  let fixture: ComponentFixture<ValidationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidationReportComponent ],
      providers: [UtilitiesService, DatePipe, MigrationService, BsModalService],
      imports : [PrimeNGModule, BrowserAnimationsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
