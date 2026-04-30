import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovefacassetComponent } from './approvefacasset.component';

describe('ApprovefacassetComponent', () => {
  let component: ApprovefacassetComponent;
  let fixture: ComponentFixture<ApprovefacassetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovefacassetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovefacassetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
