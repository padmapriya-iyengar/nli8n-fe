import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MigrationDataUploadComponent } from './migration-data-upload.component';

describe('MigrationDataUploadComponent', () => {
  let component: MigrationDataUploadComponent;
  let fixture: ComponentFixture<MigrationDataUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MigrationDataUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MigrationDataUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
