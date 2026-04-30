import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliverassetpComponent } from './deliverassetp.component';

describe('DeliverassetpComponent', () => {
  let component: DeliverassetpComponent;
  let fixture: ComponentFixture<DeliverassetpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliverassetpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliverassetpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
