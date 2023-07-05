import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { UtilitiesService } from '../../services/utilities.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AgcService } from '../../services/agc.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { WebsocketService } from '../../services/websocket.service';
import { PrimeNGModule } from '../../primeng.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardComponent ],
      providers: [UtilitiesService, MessageService, DatePipe, BsModalService, ConfirmationService, AgcService, WebsocketService],
      imports : [HttpClientModule, PrimeNGModule, BrowserAnimationsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
