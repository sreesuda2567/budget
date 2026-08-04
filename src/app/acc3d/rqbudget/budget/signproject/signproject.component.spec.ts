import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignprojectComponent } from './signproject.component';

describe('SignprojectComponent', () => {
  let component: SignprojectComponent;
  let fixture: ComponentFixture<SignprojectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignprojectComponent]
    });
    fixture = TestBed.createComponent(SignprojectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
