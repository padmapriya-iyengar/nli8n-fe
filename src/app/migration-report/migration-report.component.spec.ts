import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MigrationReportComponent } from './migration-report.component';

describe('MigrationReportComponent', () => {
  let component: MigrationReportComponent;
  let fixture: ComponentFixture<MigrationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MigrationReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MigrationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
