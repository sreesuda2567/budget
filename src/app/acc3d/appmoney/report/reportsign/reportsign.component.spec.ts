import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsignComponent } from './reportsign.component';

describe('ReportsignComponent', () => {
  let component: ReportsignComponent;
  let fixture: ComponentFixture<ReportsignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportsignComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportsignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
