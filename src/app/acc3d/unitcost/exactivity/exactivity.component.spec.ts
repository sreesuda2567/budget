import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExactivityComponent } from './exactivity.component';

describe('ExactivityComponent', () => {
  let component: ExactivityComponent;
  let fixture: ComponentFixture<ExactivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExactivityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExactivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
