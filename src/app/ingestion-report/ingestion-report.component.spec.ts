import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngestionReportComponent } from './ingestion-report.component';

describe('IngestionReportComponent', () => {
  let component: IngestionReportComponent;
  let fixture: ComponentFixture<IngestionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IngestionReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IngestionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
