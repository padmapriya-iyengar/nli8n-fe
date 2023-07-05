import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationComponent } from './notification.component';
import { UtilitiesService } from '../../services/utilities.service';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { AgcService } from '../../services/agc.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { PrimeNGModule } from '../../primeng.module';

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationComponent ],
      providers: [UtilitiesService, MessageService, DatePipe, AgcService, HttpClient, HttpHandler],
      imports: [PrimeNGModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
