import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpmedicalSummonthComponent } from './epmedical-summonth.component';

describe('EpmedicalSummonthComponent', () => {
  let component: EpmedicalSummonthComponent;
  let fixture: ComponentFixture<EpmedicalSummonthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EpmedicalSummonthComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EpmedicalSummonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
