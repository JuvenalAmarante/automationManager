import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractTypesCondominiumComponent } from './contract-types-condominium.component';

describe('ContractTypesCondominiumComponent', () => {
  let component: ContractTypesCondominiumComponent;
  let fixture: ComponentFixture<ContractTypesCondominiumComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContractTypesCondominiumComponent]
    });
    fixture = TestBed.createComponent(ContractTypesCondominiumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
