import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportcincomeComponent } from './reportcincome.component';

describe('ReportcincomeComponent', () => {
  let component: ReportcincomeComponent;
  let fixture: ComponentFixture<ReportcincomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportcincomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportcincomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
