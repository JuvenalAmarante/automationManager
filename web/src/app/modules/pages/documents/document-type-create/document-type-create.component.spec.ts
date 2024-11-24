import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentTypeCreateComponent } from './document-type-create.component';

describe('DocumentTypeCreateComponent', () => {
  let component: DocumentTypeCreateComponent;
  let fixture: ComponentFixture<DocumentTypeCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentTypeCreateComponent]
    });
    fixture = TestBed.createComponent(DocumentTypeCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
