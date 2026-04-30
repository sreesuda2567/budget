import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimateelectricityComponent } from './estimateelectricity.component';

describe('EstimateelectricityComponent', () => {
  let component: EstimateelectricityComponent;
  let fixture: ComponentFixture<EstimateelectricityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstimateelectricityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstimateelectricityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
