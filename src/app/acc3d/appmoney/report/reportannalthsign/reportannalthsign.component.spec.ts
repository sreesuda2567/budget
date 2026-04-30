import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportannalthsignComponent } from './reportannalthsign.component';

describe('ReportannalthsignComponent', () => {
  let component: ReportannalthsignComponent;
  let fixture: ComponentFixture<ReportannalthsignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportannalthsignComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportannalthsignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
