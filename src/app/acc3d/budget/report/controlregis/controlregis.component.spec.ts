import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlregisComponent } from './controlregis.component';

describe('ControlregisComponent', () => {
  let component: ControlregisComponent;
  let fixture: ComponentFixture<ControlregisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlregisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlregisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
