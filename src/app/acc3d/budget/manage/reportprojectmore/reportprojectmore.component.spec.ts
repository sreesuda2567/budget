import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportprojectmoreComponent } from './reportprojectmore.component';

describe('ReportprojectmoreComponent', () => {
  let component: ReportprojectmoreComponent;
  let fixture: ComponentFixture<ReportprojectmoreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportprojectmoreComponent]
    });
    fixture = TestBed.createComponent(ReportprojectmoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
