import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportProjectidComponent } from './report-projectid.component';

describe('ReportProjectidComponent', () => {
  let component: ReportProjectidComponent;
  let fixture: ComponentFixture<ReportProjectidComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportProjectidComponent]
    });
    fixture = TestBed.createComponent(ReportProjectidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
