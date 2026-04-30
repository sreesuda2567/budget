import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpschoolSummonthComponent } from './epschool-summonth.component';

describe('EpschoolSummonthComponent', () => {
  let component: EpschoolSummonthComponent;
  let fixture: ComponentFixture<EpschoolSummonthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EpschoolSummonthComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EpschoolSummonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
