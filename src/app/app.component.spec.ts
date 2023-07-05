import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { UtilitiesService } from './commons/services/utilities.service';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { AgcService } from './commons/services/agc.service';
import { HttpClientModule } from '@angular/common/http';
import { PrimeNGModule } from './commons/primeng.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        PrimeNGModule,
        BrowserAnimationsModule
      ],
      declarations: [
        AppComponent
      ],
      providers : [
        BsModalService, UtilitiesService, MessageService, DatePipe, AgcService
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'InterviewDemo'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('InterviewDemo');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    //expect(compiled.querySelector('.content span')?.textContent).toContain('InterviewDemo');
  });
});
