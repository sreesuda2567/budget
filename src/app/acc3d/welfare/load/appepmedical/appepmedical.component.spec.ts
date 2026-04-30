import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppepmedicalComponent } from './appepmedical.component';

describe('AppepmedicalComponent', () => {
  let component: AppepmedicalComponent;
  let fixture: ComponentFixture<AppepmedicalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppepmedicalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppepmedicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
