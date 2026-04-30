import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WritecheckComponent } from './writecheck.component';

describe('WritecheckComponent', () => {
  let component: WritecheckComponent;
  let fixture: ComponentFixture<WritecheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WritecheckComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WritecheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
