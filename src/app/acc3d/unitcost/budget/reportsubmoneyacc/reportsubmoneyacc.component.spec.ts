import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsubmoneyaccComponent } from './reportsubmoneyacc.component';

describe('ReportsubmoneyaccComponent', () => {
  let component: ReportsubmoneyaccComponent;
  let fixture: ComponentFixture<ReportsubmoneyaccComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportsubmoneyaccComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportsubmoneyaccComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
