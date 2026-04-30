import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomepmedicalComponent } from './incomepmedical.component';

describe('IncomepmedicalComponent', () => {
  let component: IncomepmedicalComponent;
  let fixture: ComponentFixture<IncomepmedicalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncomepmedicalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomepmedicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
