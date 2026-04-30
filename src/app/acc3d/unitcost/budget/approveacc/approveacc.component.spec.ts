import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveaccComponent } from './approveacc.component';

describe('ApproveaccComponent', () => {
  let component: ApproveaccComponent;
  let fixture: ComponentFixture<ApproveaccComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveaccComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproveaccComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
