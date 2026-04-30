import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentdateComponent } from './paymentdate.component';

describe('PaymentdateComponent', () => {
  let component: PaymentdateComponent;
  let fixture: ComponentFixture<PaymentdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
