import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportdayComponent } from './reportday.component';

describe('ReportdayComponent', () => {
  let component: ReportdayComponent;
  let fixture: ComponentFixture<ReportdayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportdayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportdayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
