import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentdirecComponent } from './paymentdirec.component';

describe('PaymentdirecComponent', () => {
  let component: PaymentdirecComponent;
  let fixture: ComponentFixture<PaymentdirecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentdirecComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentdirecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
