import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportdaycheckComponent } from './reportdaycheck.component';

describe('ReportdaycheckComponent', () => {
  let component: ReportdaycheckComponent;
  let fixture: ComponentFixture<ReportdaycheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportdaycheckComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportdaycheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
