import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecallReassignComponent } from './recall-reassign.component';

describe('RecallReassignComponent', () => {
  let component: RecallReassignComponent;
  let fixture: ComponentFixture<RecallReassignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecallReassignComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecallReassignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
