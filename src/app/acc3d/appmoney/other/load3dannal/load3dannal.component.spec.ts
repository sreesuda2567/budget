import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Load3dannalComponent } from './load3dannal.component';

describe('Load3dannalComponent', () => {
  let component: Load3dannalComponent;
  let fixture: ComponentFixture<Load3dannalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Load3dannalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Load3dannalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
