import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DifferencegfComponent } from './differencegf.component';

describe('DifferencegfComponent', () => {
  let component: DifferencegfComponent;
  let fixture: ComponentFixture<DifferencegfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DifferencegfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DifferencegfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
