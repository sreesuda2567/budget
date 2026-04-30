import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportlaComponent } from './reportla.component';

describe('ReportlaComponent', () => {
  let component: ReportlaComponent;
  let fixture: ComponentFixture<ReportlaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportlaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportlaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
