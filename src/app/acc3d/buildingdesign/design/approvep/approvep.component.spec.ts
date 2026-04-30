import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovepComponent } from './approvep.component';

describe('ApprovepComponent', () => {
  let component: ApprovepComponent;
  let fixture: ComponentFixture<ApprovepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovepComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
