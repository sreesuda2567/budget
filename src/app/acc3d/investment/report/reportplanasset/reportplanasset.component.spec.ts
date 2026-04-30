import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportplanassetComponent } from './reportplanasset.component';

describe('ReportplanassetComponent', () => {
  let component: ReportplanassetComponent;
  let fixture: ComponentFixture<ReportplanassetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportplanassetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportplanassetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
