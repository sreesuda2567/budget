import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferrComponent } from './offerr.component';

describe('OfferrComponent', () => {
  let component: OfferrComponent;
  let fixture: ComponentFixture<OfferrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfferrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
