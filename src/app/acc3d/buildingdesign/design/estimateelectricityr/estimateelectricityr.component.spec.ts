import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimateelectricityrComponent } from './estimateelectricityr.component';

describe('EstimateelectricityrComponent', () => {
  let component: EstimateelectricityrComponent;
  let fixture: ComponentFixture<EstimateelectricityrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstimateelectricityrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstimateelectricityrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
