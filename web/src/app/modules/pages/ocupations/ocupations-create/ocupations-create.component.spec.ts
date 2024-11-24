import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OcupationsCreateComponent } from './ocupations-create.component';

describe('OcupationsCreateComponent', () => {
  let component: OcupationsCreateComponent;
  let fixture: ComponentFixture<OcupationsCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OcupationsCreateComponent]
    });
    fixture = TestBed.createComponent(OcupationsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
