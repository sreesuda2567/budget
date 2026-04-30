import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Reportrm1Component } from './reportrm1.component';

describe('Reportrm1Component', () => {
  let component: Reportrm1Component;
  let fixture: ComponentFixture<Reportrm1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Reportrm1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Reportrm1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
