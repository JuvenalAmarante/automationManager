import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCustomFieldsComponent } from './create-custom-fields.component';

describe('CreateCustomFieldsComponent', () => {
  let component: CreateCustomFieldsComponent;
  let fixture: ComponentFixture<CreateCustomFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCustomFieldsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateCustomFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
