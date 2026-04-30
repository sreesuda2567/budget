import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovepayComponent } from './approvepay.component';

describe('ApprovepayComponent', () => {
  let component: ApprovepayComponent;
  let fixture: ComponentFixture<ApprovepayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovepayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovepayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
