import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrproductComponent } from './grproduct.component';

describe('GrproductComponent', () => {
  let component: GrproductComponent;
  let fixture: ComponentFixture<GrproductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrproductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrproductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
