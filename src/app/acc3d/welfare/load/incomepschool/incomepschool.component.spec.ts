import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomepschoolComponent } from './incomepschool.component';

describe('IncomepschoolComponent', () => {
  let component: IncomepschoolComponent;
  let fixture: ComponentFixture<IncomepschoolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncomepschoolComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomepschoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
