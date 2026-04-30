import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheckotherComponent } from './scheckother.component';

describe('ScheckotherComponent', () => {
  let component: ScheckotherComponent;
  let fixture: ComponentFixture<ScheckotherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheckotherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheckotherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
