import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportdaycorrectComponent } from './reportdaycorrect.component';

describe('ReportdaycorrectComponent', () => {
  let component: ReportdaycorrectComponent;
  let fixture: ComponentFixture<ReportdaycorrectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportdaycorrectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportdaycorrectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
