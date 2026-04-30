import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractotherwComponent } from './contractotherw.component';

describe('ContractotherwComponent', () => {
  let component: ContractotherwComponent;
  let fixture: ComponentFixture<ContractotherwComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractotherwComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractotherwComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
