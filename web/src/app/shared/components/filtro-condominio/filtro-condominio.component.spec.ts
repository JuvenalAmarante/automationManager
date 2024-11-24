import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroCondominioComponent } from './FiltroCondominioComponent';

describe('FiltroCondominioComponent', () => {
  let component: FiltroCondominioComponent;
  let fixture: ComponentFixture<FiltroCondominioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FiltroCondominioComponent]
    });
    fixture = TestBed.createComponent(FiltroCondominioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
