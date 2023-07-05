import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MigrationReportComponent } from './migration-report.component';
import { UtilitiesService } from 'src/app/commons/services/utilities.service';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';

describe('MigrationReportComponent', () => {
  let component: MigrationReportComponent;
  let fixture: ComponentFixture<MigrationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MigrationReportComponent ],
      providers: [UtilitiesService, MessageService, DatePipe]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MigrationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
