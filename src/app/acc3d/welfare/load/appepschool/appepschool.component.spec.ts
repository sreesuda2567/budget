import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppepschoolComponent } from './appepschool.component';

describe('AppepschoolComponent', () => {
  let component: AppepschoolComponent;
  let fixture: ComponentFixture<AppepschoolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppepschoolComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppepschoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
