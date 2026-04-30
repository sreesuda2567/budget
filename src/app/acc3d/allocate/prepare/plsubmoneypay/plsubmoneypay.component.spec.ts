import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlsubmoneypayComponent } from './plsubmoneypay.component';

describe('PlsubmoneypayComponent', () => {
  let component: PlsubmoneypayComponent;
  let fixture: ComponentFixture<PlsubmoneypayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlsubmoneypayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlsubmoneypayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
