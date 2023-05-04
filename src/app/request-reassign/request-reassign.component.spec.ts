import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestReassignComponent } from './request-reassign.component';

describe('RequestReassignComponent', () => {
  let component: RequestReassignComponent;
  let fixture: ComponentFixture<RequestReassignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestReassignComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestReassignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
