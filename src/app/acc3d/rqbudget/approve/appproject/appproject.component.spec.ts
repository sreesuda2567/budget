import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppprojectComponent } from './appproject.component';

describe('AppprojectComponent', () => {
  let component: AppprojectComponent;
  let fixture: ComponentFixture<AppprojectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppprojectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppprojectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
