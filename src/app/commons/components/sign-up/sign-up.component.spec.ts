import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpComponent } from './sign-up.component';
import { UtilitiesService } from '../../services/utilities.service';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { AgcService } from '../../services/agc.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { PrimeNGModule } from '../../primeng.module';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignUpComponent ],
      providers: [UtilitiesService, MessageService, DatePipe, AgcService, HttpClient, HttpHandler],
      imports: [FormsModule, PrimeNGModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
