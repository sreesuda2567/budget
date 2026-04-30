import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Load3dfsignComponent } from './load3dfsign.component';

describe('Load3dfsignComponent', () => {
  let component: Load3dfsignComponent;
  let fixture: ComponentFixture<Load3dfsignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Load3dfsignComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Load3dfsignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
