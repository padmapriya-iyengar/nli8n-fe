import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MigrationDataUploadComponent } from './migration-data-upload.component';
import { UtilitiesService } from 'src/app/commons/services/utilities.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { MigrationService } from 'src/app/commons/services/migration.service';
import { FormsModule } from '@angular/forms';
import { PrimeNGModule } from 'src/app/commons/primeng.module';

describe('MigrationDataUploadComponent', () => {
  let component: MigrationDataUploadComponent;
  let fixture: ComponentFixture<MigrationDataUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MigrationDataUploadComponent ],
      providers: [UtilitiesService, MessageService, DatePipe, ConfirmationService, MigrationService],
      imports: [FormsModule, PrimeNGModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MigrationDataUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
