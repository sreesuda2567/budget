import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckotherComponent } from './checkother.component';

describe('CheckotherComponent', () => {
  let component: CheckotherComponent;
  let fixture: ComponentFixture<CheckotherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckotherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckotherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
