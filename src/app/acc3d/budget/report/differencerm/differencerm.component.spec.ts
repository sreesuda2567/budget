import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DifferencermComponent } from './differencerm.component';

describe('DifferencermComponent', () => {
  let component: DifferencermComponent;
  let fixture: ComponentFixture<DifferencermComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DifferencermComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DifferencermComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
