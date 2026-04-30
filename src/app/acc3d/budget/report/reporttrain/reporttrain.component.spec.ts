import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporttrainComponent } from './reporttrain.component';

describe('ReporttrainComponent', () => {
  let component: ReporttrainComponent;
  let fixture: ComponentFixture<ReporttrainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporttrainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporttrainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
