import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancecheckComponent } from './financecheck.component';

describe('FinancecheckComponent', () => {
  let component: FinancecheckComponent;
  let fixture: ComponentFixture<FinancecheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinancecheckComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancecheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
