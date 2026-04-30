import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpschoolControlComponent } from './epschool-control.component';

describe('EpschoolControlComponent', () => {
  let component: EpschoolControlComponent;
  let fixture: ComponentFixture<EpschoolControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EpschoolControlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EpschoolControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
