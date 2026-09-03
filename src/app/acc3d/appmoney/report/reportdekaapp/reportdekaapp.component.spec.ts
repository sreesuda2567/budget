import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportdekaappComponent } from './reportdekaapp.component';

describe('ReportdekaappComponent', () => {
  let component: ReportdekaappComponent;
  let fixture: ComponentFixture<ReportdekaappComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportdekaappComponent]
    });
    fixture = TestBed.createComponent(ReportdekaappComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
