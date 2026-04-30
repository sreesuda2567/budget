import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpmedicalControlComponent } from './epmedical-control.component';

describe('EpmedicalControlComponent', () => {
  let component: EpmedicalControlComponent;
  let fixture: ComponentFixture<EpmedicalControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EpmedicalControlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EpmedicalControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
