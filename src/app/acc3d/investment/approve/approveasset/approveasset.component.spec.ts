import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveassetComponent } from './approveasset.component';

describe('ApproveassetComponent', () => {
  let component: ApproveassetComponent;
  let fixture: ComponentFixture<ApproveassetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveassetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproveassetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
