import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Writecheck2Component } from './writecheck2.component';

describe('Writecheck2Component', () => {
  let component: Writecheck2Component;
  let fixture: ComponentFixture<Writecheck2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Writecheck2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Writecheck2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
