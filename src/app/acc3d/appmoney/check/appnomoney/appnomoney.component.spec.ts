import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppnomoneyComponent } from './appnomoney.component';

describe('AppnomoneyComponent', () => {
  let component: AppnomoneyComponent;
  let fixture: ComponentFixture<AppnomoneyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppnomoneyComponent]
    });
    fixture = TestBed.createComponent(AppnomoneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
