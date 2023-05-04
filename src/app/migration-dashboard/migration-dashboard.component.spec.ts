import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MigrationDashboardComponent } from './migration-dashboard.component';

describe('MigrationDashboardComponent', () => {
  let component: MigrationDashboardComponent;
  let fixture: ComponentFixture<MigrationDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MigrationDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MigrationDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
