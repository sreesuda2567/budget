import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnalsendmComponent } from './annalsendm.component';

describe('AnnalsendmComponent', () => {
  let component: AnnalsendmComponent;
  let fixture: ComponentFixture<AnnalsendmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnalsendmComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnalsendmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
