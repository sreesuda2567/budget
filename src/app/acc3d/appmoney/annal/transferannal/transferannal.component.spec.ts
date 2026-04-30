import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferannalComponent } from './transferannal.component';

describe('TransferannalComponent', () => {
  let component: TransferannalComponent;
  let fixture: ComponentFixture<TransferannalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferannalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferannalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
