import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportdayappcComponent } from './reportdayappc.component';

describe('ReportdayappcComponent', () => {
  let component: ReportdayappcComponent;
  let fixture: ComponentFixture<ReportdayappcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportdayappcComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportdayappcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
