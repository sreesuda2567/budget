import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterprojectComponent } from './registerproject.component';

describe('RegisterprojectComponent', () => {
  let component: RegisterprojectComponent;
  let fixture: ComponentFixture<RegisterprojectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterprojectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterprojectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
