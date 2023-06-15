import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MigConsolidatedReportComponent } from './mig-consolidated-report.component';

describe('MigConsolidatedReportComponent', () => {
  let component: MigConsolidatedReportComponent;
  let fixture: ComponentFixture<MigConsolidatedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MigConsolidatedReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MigConsolidatedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
