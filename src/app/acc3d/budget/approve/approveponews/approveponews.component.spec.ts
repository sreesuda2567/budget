import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveponewsComponent } from './approveponews.component';

describe('ApproveponewsComponent', () => {
  let component: ApproveponewsComponent;
  let fixture: ComponentFixture<ApproveponewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveponewsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproveponewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
