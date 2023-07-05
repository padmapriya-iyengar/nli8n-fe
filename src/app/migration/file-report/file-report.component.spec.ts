import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileReportComponent } from './file-report.component';
import { UtilitiesService } from 'src/app/commons/services/utilities.service';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MigrationService } from 'src/app/commons/services/migration.service';
import { PrimeNGModule } from 'src/app/commons/primeng.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('FileReportComponent', () => {
  let component: FileReportComponent;
  let fixture: ComponentFixture<FileReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileReportComponent ],
      providers: [UtilitiesService, MessageService, DatePipe, BsModalService, MigrationService],
      imports : [PrimeNGModule, BrowserAnimationsModule]
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
