import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpschoolretireComponent } from './epschoolretire.component';

describe('EpschoolretireComponent', () => {
  let component: EpschoolretireComponent;
  let fixture: ComponentFixture<EpschoolretireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EpschoolretireComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EpschoolretireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
