import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorFormInputComponent } from './editor-form-input.component';

describe('EditorFormInputComponent', () => {
  let component: EditorFormInputComponent;
  let fixture: ComponentFixture<EditorFormInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditorFormInputComponent]
    });
    fixture = TestBed.createComponent(EditorFormInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
