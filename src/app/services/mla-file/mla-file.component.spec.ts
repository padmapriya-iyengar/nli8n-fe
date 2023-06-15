import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MlaFileComponent } from './mla-file.component';

describe('MlaFileComponent', () => {
  let component: MlaFileComponent;
  let fixture: ComponentFixture<MlaFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MlaFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MlaFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
