import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovemiddleComponent } from './approvemiddle.component';

describe('ApprovemiddleComponent', () => {
  let component: ApprovemiddleComponent;
  let fixture: ComponentFixture<ApprovemiddleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovemiddleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovemiddleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
