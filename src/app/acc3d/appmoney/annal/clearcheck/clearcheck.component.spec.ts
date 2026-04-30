import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearcheckComponent } from './clearcheck.component';

describe('ClearcheckComponent', () => {
  let component: ClearcheckComponent;
  let fixture: ComponentFixture<ClearcheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClearcheckComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClearcheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
