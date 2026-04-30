import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovebuildingComponent } from './approvebuilding.component';

describe('ApprovebuildingComponent', () => {
  let component: ApprovebuildingComponent;
  let fixture: ComponentFixture<ApprovebuildingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovebuildingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovebuildingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
