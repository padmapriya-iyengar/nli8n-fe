import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MlaRequestComponent } from './mla-request.component';
import { UtilitiesService } from 'src/app/commons/services/utilities.service';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { AgcService } from 'src/app/commons/services/agc.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { PrimeNGModule } from 'src/app/commons/primeng.module';

describe('MlaRequestComponent', () => {
  let component: MlaRequestComponent;
  let fixture: ComponentFixture<MlaRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MlaRequestComponent ],
      providers: [UtilitiesService, MessageService, DatePipe, AgcService, HttpClient, HttpHandler],
      imports: [PrimeNGModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MlaRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
