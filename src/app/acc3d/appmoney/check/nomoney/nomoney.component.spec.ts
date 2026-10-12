import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NomoneyComponent } from './nomoney.component';

describe('NomoneyComponent', () => {
  let component: NomoneyComponent;
  let fixture: ComponentFixture<NomoneyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NomoneyComponent]
    });
    fixture = TestBed.createComponent(NomoneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
