import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Writecheck1Component } from './writecheck1.component';

describe('Writecheck1Component', () => {
  let component: Writecheck1Component;
  let fixture: ComponentFixture<Writecheck1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Writecheck1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Writecheck1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
