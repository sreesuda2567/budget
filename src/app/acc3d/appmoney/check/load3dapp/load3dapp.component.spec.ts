import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Load3dappComponent } from './load3dapp.component';

describe('Load3dappComponent', () => {
  let component: Load3dappComponent;
  let fixture: ComponentFixture<Load3dappComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Load3dappComponent]
    });
    fixture = TestBed.createComponent(Load3dappComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
