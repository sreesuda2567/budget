import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowprojectComponent } from './followproject.component';

describe('FollowprojectComponent', () => {
  let component: FollowprojectComponent;
  let fixture: ComponentFixture<FollowprojectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollowprojectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FollowprojectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
