import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Load3dComponent } from './load3d.component';

describe('Load3dComponent', () => {
  let component: Load3dComponent;
  let fixture: ComponentFixture<Load3dComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Load3dComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Load3dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
