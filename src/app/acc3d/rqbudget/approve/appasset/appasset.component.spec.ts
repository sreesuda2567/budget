import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppassetComponent } from './appasset.component';

describe('AppassetComponent', () => {
  let component: AppassetComponent;
  let fixture: ComponentFixture<AppassetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppassetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppassetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
