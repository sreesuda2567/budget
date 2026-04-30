import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnalrefundComponent } from './annalrefund.component';

describe('AnnalrefundComponent', () => {
  let component: AnnalrefundComponent;
  let fixture: ComponentFixture<AnnalrefundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnalrefundComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnalrefundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
