import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForemanComponent } from './foreman.component';

describe('ForemanComponent', () => {
  let component: ForemanComponent;
  let fixture: ComponentFixture<ForemanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForemanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForemanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
