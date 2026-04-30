import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliverbuildingComponent } from './deliverbuilding.component';

describe('DeliverbuildingComponent', () => {
  let component: DeliverbuildingComponent;
  let fixture: ComponentFixture<DeliverbuildingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliverbuildingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliverbuildingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
