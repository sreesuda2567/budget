import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Load3dsignComponent } from './load3dsign.component';

describe('Load3dsignComponent', () => {
  let component: Load3dsignComponent;
  let fixture: ComponentFixture<Load3dsignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Load3dsignComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Load3dsignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
