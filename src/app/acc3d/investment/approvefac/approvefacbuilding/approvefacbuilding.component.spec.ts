import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovefacbuildingComponent } from './approvefacbuilding.component';

describe('ApprovefacbuildingComponent', () => {
  let component: ApprovefacbuildingComponent;
  let fixture: ComponentFixture<ApprovefacbuildingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovefacbuildingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovefacbuildingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
