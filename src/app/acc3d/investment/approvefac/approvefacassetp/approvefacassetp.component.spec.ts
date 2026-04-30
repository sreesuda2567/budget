import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovefacassetpComponent } from './approvefacassetp.component';

describe('ApprovefacassetpComponent', () => {
  let component: ApprovefacassetpComponent;
  let fixture: ComponentFixture<ApprovefacassetpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovefacassetpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovefacassetpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
