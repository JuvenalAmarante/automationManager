/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ContractTypesCondominiumCreateComponent } from './contract-types-condominium-create.component';

describe('ContractTypesCondominiumCreateComponent', () => {
  let component: ContractTypesCondominiumCreateComponent;
  let fixture: ComponentFixture<ContractTypesCondominiumCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractTypesCondominiumCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractTypesCondominiumCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
