import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportrqprojectComponent } from './reportrqproject.component';

describe('ReportrqprojectComponent', () => {
  let component: ReportrqprojectComponent;
  let fixture: ComponentFixture<ReportrqprojectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportrqprojectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportrqprojectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
