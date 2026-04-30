import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimatestructureComponent } from './estimatestructure.component';

describe('EstimatestructureComponent', () => {
  let component: EstimatestructureComponent;
  let fixture: ComponentFixture<EstimatestructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstimatestructureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstimatestructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
