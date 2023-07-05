import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentVersionsComponent } from './document-versions.component';
import { UtilitiesService } from '../../services/utilities.service';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { PrimeNGModule } from '../../primeng.module';

describe('DocumentVersionsComponent', () => {
  let component: DocumentVersionsComponent;
  let fixture: ComponentFixture<DocumentVersionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentVersionsComponent ],
      providers: [UtilitiesService, MessageService, DatePipe],
      imports: [PrimeNGModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentVersionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
