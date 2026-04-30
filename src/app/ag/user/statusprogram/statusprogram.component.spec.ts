import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusprogramComponent } from './statusprogram.component';

describe('StatusprogramComponent', () => {
  let component: StatusprogramComponent;
  let fixture: ComponentFixture<StatusprogramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatusprogramComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusprogramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
