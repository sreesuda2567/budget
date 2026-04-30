import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportledgerComponent } from './reportledger.component';

describe('ReportledgerComponent', () => {
  let component: ReportledgerComponent;
  let fixture: ComponentFixture<ReportledgerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportledgerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportledgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
