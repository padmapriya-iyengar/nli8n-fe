import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationReportComponent } from './validation-report.component';
import { UtilitiesService } from 'src/app/commons/services/utilities.service';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';

describe('ValidationReportComponent', () => {
  let component: ValidationReportComponent;
  let fixture: ComponentFixture<ValidationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidationReportComponent ],
      providers: [UtilitiesService, MessageService, DatePipe]
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
