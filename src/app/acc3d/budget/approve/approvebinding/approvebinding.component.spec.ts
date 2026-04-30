import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovebindingComponent } from './approvebinding.component';

describe('ApprovebindingComponent', () => {
  let component: ApprovebindingComponent;
  let fixture: ComponentFixture<ApprovebindingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovebindingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovebindingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
