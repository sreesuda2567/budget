import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Load3dmComponent } from './load3dm.component';

describe('Load3dmComponent', () => {
  let component: Load3dmComponent;
  let fixture: ComponentFixture<Load3dmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Load3dmComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Load3dmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
