import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractnumberComponent } from './contractnumber.component';

describe('ContractnumberComponent', () => {
  let component: ContractnumberComponent;
  let fixture: ComponentFixture<ContractnumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractnumberComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractnumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
