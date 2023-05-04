import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestReopenComponent } from './request-reopen.component';

describe('RequestReopenComponent', () => {
  let component: RequestReopenComponent;
  let fixture: ComponentFixture<RequestReopenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestReopenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestReopenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
