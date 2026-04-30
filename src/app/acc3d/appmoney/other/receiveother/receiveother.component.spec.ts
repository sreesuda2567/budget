import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveotherComponent } from './receiveother.component';

describe('ReceiveotherComponent', () => {
  let component: ReceiveotherComponent;
  let fixture: ComponentFixture<ReceiveotherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiveotherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceiveotherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
