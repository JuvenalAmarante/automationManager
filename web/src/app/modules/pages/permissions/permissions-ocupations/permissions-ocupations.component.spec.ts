import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionsOcupationsComponent } from './permissions-ocupations.component';

describe('PermissionsOcupationsComponent', () => {
  let component: PermissionsOcupationsComponent;
  let fixture: ComponentFixture<PermissionsOcupationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PermissionsOcupationsComponent]
    });
    fixture = TestBed.createComponent(PermissionsOcupationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
