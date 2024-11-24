import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionsUsersComponent } from './permissions-users.component';

describe('PermissionsUsersComponent', () => {
  let component: PermissionsUsersComponent;
  let fixture: ComponentFixture<PermissionsUsersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PermissionsUsersComponent]
    });
    fixture = TestBed.createComponent(PermissionsUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
