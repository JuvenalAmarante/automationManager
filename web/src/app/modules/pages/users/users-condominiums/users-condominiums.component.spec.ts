import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersCondominiumsComponent } from './users-condominiums.component';

describe('UsersCondominiumsComponent', () => {
  let component: UsersCondominiumsComponent;
  let fixture: ComponentFixture<UsersCondominiumsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsersCondominiumsComponent]
    });
    fixture = TestBed.createComponent(UsersCondominiumsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
