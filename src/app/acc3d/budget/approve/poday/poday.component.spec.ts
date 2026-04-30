import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PodayComponent } from './poday.component';

describe('PodayComponent', () => {
  let component: PodayComponent;
  let fixture: ComponentFixture<PodayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PodayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PodayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
