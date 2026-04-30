import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportplanprojectComponent } from './reportplanproject.component';

describe('ReportplanprojectComponent', () => {
  let component: ReportplanprojectComponent;
  let fixture: ComponentFixture<ReportplanprojectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportplanprojectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportplanprojectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
