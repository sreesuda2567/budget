import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportamendComponent } from './reportamend.component';

describe('ReportamendComponent', () => {
  let component: ReportamendComponent;
  let fixture: ComponentFixture<ReportamendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportamendComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportamendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
