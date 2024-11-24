import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCustomFormComponent } from './create-custom-form.component';

describe('CreateCustomFormComponent', () => {
  let component: CreateCustomFormComponent;
  let fixture: ComponentFixture<CreateCustomFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateCustomFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateCustomFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
