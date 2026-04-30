import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsplanbuildingComponent } from './reportsplanbuilding.component';

describe('ReportsplanbuildingComponent', () => {
  let component: ReportsplanbuildingComponent;
  let fixture: ComponentFixture<ReportsplanbuildingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportsplanbuildingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportsplanbuildingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
