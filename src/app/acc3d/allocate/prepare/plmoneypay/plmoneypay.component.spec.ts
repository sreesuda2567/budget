import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlmoneypayComponent } from './plmoneypay.component';

describe('PlmoneypayComponent', () => {
  let component: PlmoneypayComponent;
  let fixture: ComponentFixture<PlmoneypayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlmoneypayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlmoneypayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
