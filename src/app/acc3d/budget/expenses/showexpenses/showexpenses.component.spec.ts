import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowexpensesComponent } from './showexpenses.component';

describe('ShowexpensesComponent', () => {
  let component: ShowexpensesComponent;
  let fixture: ComponentFixture<ShowexpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowexpensesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowexpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
