import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsplanassetComponent } from './reportsplanasset.component';

describe('ReportsplanassetComponent', () => {
  let component: ReportsplanassetComponent;
  let fixture: ComponentFixture<ReportsplanassetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportsplanassetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportsplanassetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
