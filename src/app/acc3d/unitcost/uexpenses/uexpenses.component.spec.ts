import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UexpensesComponent } from './uexpenses.component';

describe('UexpensesComponent', () => {
  let component: UexpensesComponent;
  let fixture: ComponentFixture<UexpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UexpensesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UexpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
