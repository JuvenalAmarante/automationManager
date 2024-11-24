import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OcupationsComponent } from './ocupations.component';

describe('OcupationsComponent', () => {
  let component: OcupationsComponent;
  let fixture: ComponentFixture<OcupationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OcupationsComponent]
    });
    fixture = TestBed.createComponent(OcupationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
