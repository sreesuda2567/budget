import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportannalthComponent } from './reportannalth.component';

describe('ReportannalthComponent', () => {
  let component: ReportannalthComponent;
  let fixture: ComponentFixture<ReportannalthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportannalthComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportannalthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
