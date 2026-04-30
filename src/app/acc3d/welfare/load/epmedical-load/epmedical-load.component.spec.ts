import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpmedicalLoadComponent } from './epmedical-load.component';

describe('EpmedicalLoadComponent', () => {
  let component: EpmedicalLoadComponent;
  let fixture: ComponentFixture<EpmedicalLoadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EpmedicalLoadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EpmedicalLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
