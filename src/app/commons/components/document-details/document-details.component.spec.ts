import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentDetailsComponent } from './document-details.component';
import { UtilitiesService } from '../../services/utilities.service';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimeNGModule } from '../../primeng.module';

describe('DocumentDetailsComponent', () => {
  let component: DocumentDetailsComponent;
  let fixture: ComponentFixture<DocumentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentDetailsComponent ],
      providers: [UtilitiesService, MessageService, DatePipe],
      imports: [FormsModule, PrimeNGModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
