import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmprojectComponent } from './smproject.component';

describe('SmprojectComponent', () => {
  let component: SmprojectComponent;
  let fixture: ComponentFixture<SmprojectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmprojectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmprojectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
