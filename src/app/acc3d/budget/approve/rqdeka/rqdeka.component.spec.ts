import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RqdekaComponent } from './rqdeka.component';

describe('RqdekaComponent', () => {
  let component: RqdekaComponent;
  let fixture: ComponentFixture<RqdekaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RqdekaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RqdekaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
