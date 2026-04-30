import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RqtprojectComponent } from './rqtproject.component';

describe('RqtprojectComponent', () => {
  let component: RqtprojectComponent;
  let fixture: ComponentFixture<RqtprojectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RqtprojectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RqtprojectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
