import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsplanprojectComponent } from './reportsplanproject.component';

describe('ReportsplanprojectComponent', () => {
  let component: ReportsplanprojectComponent;
  let fixture: ComponentFixture<ReportsplanprojectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportsplanprojectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportsplanprojectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
