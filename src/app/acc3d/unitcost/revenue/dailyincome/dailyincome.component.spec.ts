import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyincomeComponent } from './dailyincome.component';

describe('DailyincomeComponent', () => {
  let component: DailyincomeComponent;
  let fixture: ComponentFixture<DailyincomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyincomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyincomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
