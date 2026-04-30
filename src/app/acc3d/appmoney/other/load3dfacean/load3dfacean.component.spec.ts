import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Load3dfaceanComponent } from './load3dfacean.component';

describe('Load3dfaceanComponent', () => {
  let component: Load3dfaceanComponent;
  let fixture: ComponentFixture<Load3dfaceanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Load3dfaceanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Load3dfaceanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
