import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DekamonthComponent } from './dekamonth.component';

describe('DekamonthComponent', () => {
  let component: DekamonthComponent;
  let fixture: ComponentFixture<DekamonthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DekamonthComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DekamonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
