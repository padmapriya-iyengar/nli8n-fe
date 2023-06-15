import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordDataComponent } from './record-data.component';

describe('RecordDataComponent', () => {
  let component: RecordDataComponent;
  let fixture: ComponentFixture<RecordDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecordDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
