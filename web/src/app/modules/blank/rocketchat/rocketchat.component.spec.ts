import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RocketchatComponent } from './rocketchat.component';

describe('RocketchatComponent', () => {
  let component: RocketchatComponent;
  let fixture: ComponentFixture<RocketchatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RocketchatComponent]
    });
    fixture = TestBed.createComponent(RocketchatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
