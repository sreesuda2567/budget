import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractotherComponent } from './contractother.component';

describe('ContractotherComponent', () => {
  let component: ContractotherComponent;
  let fixture: ComponentFixture<ContractotherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractotherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractotherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
