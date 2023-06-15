import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentVersionsComponent } from './document-versions.component';

describe('DocumentVersionsComponent', () => {
  let component: DocumentVersionsComponent;
  let fixture: ComponentFixture<DocumentVersionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentVersionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentVersionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
