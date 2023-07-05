import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordDataComponent } from './record-data.component';
import { UtilitiesService } from 'src/app/commons/services/utilities.service';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { MigrationService } from 'src/app/commons/services/migration.service';
import { PrimeNGModule } from 'src/app/commons/primeng.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('RecordDataComponent', () => {
  let component: RecordDataComponent;
  let fixture: ComponentFixture<RecordDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordDataComponent ],
      providers: [UtilitiesService, MessageService, DatePipe, MigrationService],
      imports: [PrimeNGModule, BrowserAnimationsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecordDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
