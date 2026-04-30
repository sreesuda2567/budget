import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListexpensesComponent } from './listexpenses.component';

describe('ListexpensesComponent', () => {
  let component: ListexpensesComponent;
  let fixture: ComponentFixture<ListexpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListexpensesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListexpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
