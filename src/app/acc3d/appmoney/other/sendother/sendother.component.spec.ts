import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendotherComponent } from './sendother.component';

describe('SendotherComponent', () => {
  let component: SendotherComponent;
  let fixture: ComponentFixture<SendotherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendotherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendotherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
