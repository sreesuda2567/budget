import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Reportrm4Component } from './reportrm4.component';

describe('Reportrm4Component', () => {
  let component: Reportrm4Component;
  let fixture: ComponentFixture<Reportrm4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Reportrm4Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Reportrm4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
