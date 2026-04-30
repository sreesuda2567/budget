import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsubmoneyComponent } from './reportsubmoney.component';

describe('ReportsubmoneyComponent', () => {
  let component: ReportsubmoneyComponent;
  let fixture: ComponentFixture<ReportsubmoneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportsubmoneyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportsubmoneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
