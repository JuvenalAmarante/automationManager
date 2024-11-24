import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelAddButtonComponent } from './label-add-button.component';

describe('LabelAddButtonComponent', () => {
  let component: LabelAddButtonComponent;
  let fixture: ComponentFixture<LabelAddButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LabelAddButtonComponent]
    });
    fixture = TestBed.createComponent(LabelAddButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
