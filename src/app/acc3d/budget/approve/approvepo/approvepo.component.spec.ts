import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovepoComponent } from './approvepo.component';

describe('ApprovepoComponent', () => {
  let component: ApprovepoComponent;
  let fixture: ComponentFixture<ApprovepoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovepoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovepoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
