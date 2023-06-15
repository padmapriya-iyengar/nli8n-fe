import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvisoryFileComponent } from './advisory-file.component';

describe('AdvisoryFileComponent', () => {
  let component: AdvisoryFileComponent;
  let fixture: ComponentFixture<AdvisoryFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvisoryFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvisoryFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should load divisions', () => {
    console.log(component.advfileForm.controls['fileDiv'].value);
  })
});
