import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisbursementappComponent } from './disbursementapp.component';

describe('DisbursementappComponent', () => {
  let component: DisbursementappComponent;
  let fixture: ComponentFixture<DisbursementappComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisbursementappComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisbursementappComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
