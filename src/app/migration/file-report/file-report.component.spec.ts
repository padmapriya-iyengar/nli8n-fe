import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileReportComponent } from './file-report.component';
import { UtilitiesService } from 'src/app/commons/services/utilities.service';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';

describe('FileReportComponent', () => {
  let component: FileReportComponent;
  let fixture: ComponentFixture<FileReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileReportComponent ],
      providers: [UtilitiesService, MessageService, DatePipe]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
