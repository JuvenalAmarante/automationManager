import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomFormsComponent } from './custom-forms.component';

describe('CustomFormsComponent', () => {
  let component: CustomFormsComponent;
  let fixture: ComponentFixture<CustomFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomFormsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
