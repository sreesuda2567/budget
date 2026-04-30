import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Load3dfaceComponent } from './load3dface.component';

describe('Load3dfaceComponent', () => {
  let component: Load3dfaceComponent;
  let fixture: ComponentFixture<Load3dfaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Load3dfaceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Load3dfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
