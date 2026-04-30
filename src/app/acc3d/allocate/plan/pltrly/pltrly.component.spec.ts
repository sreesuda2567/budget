import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PltrlyComponent } from './pltrly.component';

describe('PltrlyComponent', () => {
  let component: PltrlyComponent;
  let fixture: ComponentFixture<PltrlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PltrlyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PltrlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
