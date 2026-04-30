import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsplanassetpComponent } from './reportsplanassetp.component';

describe('ReportsplanassetpComponent', () => {
  let component: ReportsplanassetpComponent;
  let fixture: ComponentFixture<ReportsplanassetpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportsplanassetpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportsplanassetpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
