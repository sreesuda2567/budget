import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlexpensesComponent } from './plexpenses.component';

describe('PlexpensesComponent', () => {
  let component: PlexpensesComponent;
  let fixture: ComponentFixture<PlexpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlexpensesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlexpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
