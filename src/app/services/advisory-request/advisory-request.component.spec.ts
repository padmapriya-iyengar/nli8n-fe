import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvisoryRequestComponent } from './advisory-request.component';

describe('AdvisoryRequestComponent', () => {
  let component: AdvisoryRequestComponent;
  let fixture: ComponentFixture<AdvisoryRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvisoryRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvisoryRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
