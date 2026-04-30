import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearbudgetComponent } from './yearbudget.component';

describe('YearbudgetComponent', () => {
  let component: YearbudgetComponent;
  let fixture: ComponentFixture<YearbudgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YearbudgetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YearbudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
