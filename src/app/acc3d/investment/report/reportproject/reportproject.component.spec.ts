import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportprojectComponent } from './reportproject.component';

describe('ReportprojectComponent', () => {
  let component: ReportprojectComponent;
  let fixture: ComponentFixture<ReportprojectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportprojectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportprojectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
