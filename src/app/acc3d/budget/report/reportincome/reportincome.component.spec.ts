import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportincomeComponent } from './reportincome.component';

describe('ReportincomeComponent', () => {
  let component: ReportincomeComponent;
  let fixture: ComponentFixture<ReportincomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportincomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportincomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
