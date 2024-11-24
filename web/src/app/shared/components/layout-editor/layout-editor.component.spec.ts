import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutEditorComponent } from './layout-editor.component';

describe('LayoutEditorComponent', () => {
  let component: LayoutEditorComponent;
  let fixture: ComponentFixture<LayoutEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LayoutEditorComponent],
    });
    fixture = TestBed.createComponent(LayoutEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
