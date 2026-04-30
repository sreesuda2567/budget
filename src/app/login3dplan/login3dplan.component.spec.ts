import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Login3dplanComponent } from './login3dplan.component';

describe('Login3dplanComponent', () => {
  let component: Login3dplanComponent;
  let fixture: ComponentFixture<Login3dplanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Login3dplanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Login3dplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
