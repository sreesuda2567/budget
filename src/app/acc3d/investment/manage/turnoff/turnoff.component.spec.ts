import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnoffComponent } from './turnoff.component';

describe('TurnoffComponent', () => {
  let component: TurnoffComponent;
  let fixture: ComponentFixture<TurnoffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TurnoffComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TurnoffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
