import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCustomFieldsComponent } from './select-custom-fields.component';

describe('SelectCustomFieldsComponent', () => {
  let component: SelectCustomFieldsComponent;
  let fixture: ComponentFixture<SelectCustomFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectCustomFieldsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectCustomFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
