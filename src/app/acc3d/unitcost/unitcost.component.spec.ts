import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitcostComponent } from './unitcost.component';

describe('UnitcostComponent', () => {
  let component: UnitcostComponent;
  let fixture: ComponentFixture<UnitcostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitcostComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitcostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
