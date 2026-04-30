import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliverassetComponent } from './deliverasset.component';

describe('DeliverassetComponent', () => {
  let component: DeliverassetComponent;
  let fixture: ComponentFixture<DeliverassetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliverassetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliverassetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
