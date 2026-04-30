import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveprojectComponent } from './approveproject.component';

describe('ApproveprojectComponent', () => {
  let component: ApproveprojectComponent;
  let fixture: ComponentFixture<ApproveprojectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveprojectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproveprojectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
