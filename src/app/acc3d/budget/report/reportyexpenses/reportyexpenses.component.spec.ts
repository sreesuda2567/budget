import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportyexpensesComponent } from './reportyexpenses.component';

describe('ReportyexpensesComponent', () => {
  let component: ReportyexpensesComponent;
  let fixture: ComponentFixture<ReportyexpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportyexpensesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportyexpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
