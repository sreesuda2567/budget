import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FpaymentdateComponent } from './fpaymentdate.component';

describe('FpaymentdateComponent', () => {
  let component: FpaymentdateComponent;
  let fixture: ComponentFixture<FpaymentdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FpaymentdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FpaymentdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
