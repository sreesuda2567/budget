import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportdayeditComponent } from './reportdayedit.component';

describe('ReportdayeditComponent', () => {
  let component: ReportdayeditComponent;
  let fixture: ComponentFixture<ReportdayeditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportdayeditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportdayeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
