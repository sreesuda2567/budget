import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnalsendckComponent } from './annalsendck.component';

describe('AnnalsendckComponent', () => {
  let component: AnnalsendckComponent;
  let fixture: ComponentFixture<AnnalsendckComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnnalsendckComponent]
    });
    fixture = TestBed.createComponent(AnnalsendckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
