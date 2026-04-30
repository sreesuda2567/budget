import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportplanbuildingComponent } from './reportplanbuilding.component';

describe('ReportplanbuildingComponent', () => {
  let component: ReportplanbuildingComponent;
  let fixture: ComponentFixture<ReportplanbuildingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportplanbuildingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportplanbuildingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
