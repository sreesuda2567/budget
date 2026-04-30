import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovefacprojectComponent } from './approvefacproject.component';

describe('ApprovefacprojectComponent', () => {
  let component: ApprovefacprojectComponent;
  let fixture: ComponentFixture<ApprovefacprojectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovefacprojectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovefacprojectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
