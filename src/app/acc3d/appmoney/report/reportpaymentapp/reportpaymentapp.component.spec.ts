import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportpaymentappComponent } from './reportpaymentapp.component';

describe('ReportpaymentappComponent', () => {
  let component: ReportpaymentappComponent;
  let fixture: ComponentFixture<ReportpaymentappComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportpaymentappComponent]
    });
    fixture = TestBed.createComponent(ReportpaymentappComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
