import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportassetComponent } from './reportasset.component';

describe('ReportassetComponent', () => {
  let component: ReportassetComponent;
  let fixture: ComponentFixture<ReportassetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportassetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportassetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
