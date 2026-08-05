import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RqpaymentComponent } from './rqpayment.component';

describe('RqpaymentComponent', () => {
  let component: RqpaymentComponent;
  let fixture: ComponentFixture<RqpaymentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RqpaymentComponent]
    });
    fixture = TestBed.createComponent(RqpaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
