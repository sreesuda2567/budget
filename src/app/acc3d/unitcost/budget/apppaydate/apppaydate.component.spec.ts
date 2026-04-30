import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApppaydateComponent } from './apppaydate.component';

describe('ApppaydateComponent', () => {
  let component: ApppaydateComponent;
  let fixture: ComponentFixture<ApppaydateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApppaydateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApppaydateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
