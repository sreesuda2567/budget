import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Useracc3dComponent } from './useracc3d.component';

describe('Useracc3dComponent', () => {
  let component: Useracc3dComponent;
  let fixture: ComponentFixture<Useracc3dComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Useracc3dComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Useracc3dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
