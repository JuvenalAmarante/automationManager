import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListResponsaveisComponent } from './list-responsaveis.component';

describe('ListResponsaveisComponent', () => {
  let component: ListResponsaveisComponent;
  let fixture: ComponentFixture<ListResponsaveisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListResponsaveisComponent]
    });
    fixture = TestBed.createComponent(ListResponsaveisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
