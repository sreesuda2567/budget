import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Load3dfappComponent } from './load3dfapp.component';

describe('Load3dfappComponent', () => {
  let component: Load3dfappComponent;
  let fixture: ComponentFixture<Load3dfappComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Load3dfappComponent]
    });
    fixture = TestBed.createComponent(Load3dfappComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
