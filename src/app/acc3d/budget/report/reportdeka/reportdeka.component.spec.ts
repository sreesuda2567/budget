import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportdekaComponent } from './reportdeka.component';

describe('ReportdekaComponent', () => {
  let component: ReportdekaComponent;
  let fixture: ComponentFixture<ReportdekaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportdekaComponent]
    });
    fixture = TestBed.createComponent(ReportdekaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
