import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportbuildingComponent } from './reportbuilding.component';

describe('ReportbuildingComponent', () => {
  let component: ReportbuildingComponent;
  let fixture: ComponentFixture<ReportbuildingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportbuildingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportbuildingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
