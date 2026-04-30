import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoneytypeComponent } from './moneytype.component';

describe('MoneytypeComponent', () => {
  let component: MoneytypeComponent;
  let fixture: ComponentFixture<MoneytypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoneytypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoneytypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
