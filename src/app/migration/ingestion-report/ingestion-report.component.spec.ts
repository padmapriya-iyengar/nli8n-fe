import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngestionReportComponent } from './ingestion-report.component';
import { UtilitiesService } from 'src/app/commons/services/utilities.service';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';

describe('IngestionReportComponent', () => {
  let component: IngestionReportComponent;
  let fixture: ComponentFixture<IngestionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IngestionReportComponent ],
      providers: [UtilitiesService, MessageService, DatePipe]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IngestionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
