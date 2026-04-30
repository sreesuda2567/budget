import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportannalComponent } from './reportannal.component';

describe('ReportannalComponent', () => {
  let component: ReportannalComponent;
  let fixture: ComponentFixture<ReportannalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportannalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportannalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
