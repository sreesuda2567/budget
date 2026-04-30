import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnotherComponent } from './returnother.component';

describe('ReturnotherComponent', () => {
  let component: ReturnotherComponent;
  let fixture: ComponentFixture<ReturnotherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReturnotherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReturnotherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
