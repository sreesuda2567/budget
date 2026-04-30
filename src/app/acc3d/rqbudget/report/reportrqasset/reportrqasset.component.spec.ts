import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportrqassetComponent } from './reportrqasset.component';

describe('ReportrqassetComponent', () => {
  let component: ReportrqassetComponent;
  let fixture: ComponentFixture<ReportrqassetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportrqassetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportrqassetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
