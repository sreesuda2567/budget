import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimatestructurerComponent } from './estimatestructurer.component';

describe('EstimatestructurerComponent', () => {
  let component: EstimatestructurerComponent;
  let fixture: ComponentFixture<EstimatestructurerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstimatestructurerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstimatestructurerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
