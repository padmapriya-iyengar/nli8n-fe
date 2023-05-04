import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MlaRequestComponent } from './mla-request.component';

describe('MlaRequestComponent', () => {
  let component: MlaRequestComponent;
  let fixture: ComponentFixture<MlaRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MlaRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MlaRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
