import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpschoolLoadComponent } from './epschool-load.component';

describe('EpschoolLoadComponent', () => {
  let component: EpschoolLoadComponent;
  let fixture: ComponentFixture<EpschoolLoadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EpschoolLoadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EpschoolLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
