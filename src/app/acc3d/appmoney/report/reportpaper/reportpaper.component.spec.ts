import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportpaperComponent } from './reportpaper.component';

describe('ReportpaperComponent', () => {
  let component: ReportpaperComponent;
  let fixture: ComponentFixture<ReportpaperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportpaperComponent]
    });
    fixture = TestBed.createComponent(ReportpaperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
