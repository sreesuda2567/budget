import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositdateComponent } from './depositdate.component';

describe('DepositdateComponent', () => {
  let component: DepositdateComponent;
  let fixture: ComponentFixture<DepositdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepositdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepositdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
