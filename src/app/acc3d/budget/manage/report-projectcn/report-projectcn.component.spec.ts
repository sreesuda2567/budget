import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportProjectcnComponent } from './report-projectcn.component';

describe('ReportProjectcnComponent', () => {
  let component: ReportProjectcnComponent;
  let fixture: ComponentFixture<ReportProjectcnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportProjectcnComponent]
    });
    fixture = TestBed.createComponent(ReportProjectcnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
