import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppbuildingComponent } from './appbuilding.component';

describe('AppbuildingComponent', () => {
  let component: AppbuildingComponent;
  let fixture: ComponentFixture<AppbuildingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppbuildingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppbuildingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
