import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportdayappComponent } from './reportdayapp.component';

describe('ReportdayappComponent', () => {
  let component: ReportdayappComponent;
  let fixture: ComponentFixture<ReportdayappComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportdayappComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportdayappComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
