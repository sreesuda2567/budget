import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportpurchaseComponent } from './reportpurchase.component';

describe('ReportpurchaseComponent', () => {
  let component: ReportpurchaseComponent;
  let fixture: ComponentFixture<ReportpurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportpurchaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportpurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
