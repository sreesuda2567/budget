import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliverprojectComponent } from './deliverproject.component';

describe('DeliverprojectComponent', () => {
  let component: DeliverprojectComponent;
  let fixture: ComponentFixture<DeliverprojectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliverprojectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliverprojectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
