import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportfexpensesComponent } from './reportfexpenses.component';

describe('ReportfexpensesComponent', () => {
  let component: ReportfexpensesComponent;
  let fixture: ComponentFixture<ReportfexpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportfexpensesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportfexpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
