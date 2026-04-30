import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Listrm4Component } from './listrm4.component';

describe('Listrm4Component', () => {
  let component: Listrm4Component;
  let fixture: ComponentFixture<Listrm4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Listrm4Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Listrm4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
