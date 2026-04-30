import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberretireComponent } from './memberretire.component';

describe('MemberretireComponent', () => {
  let component: MemberretireComponent;
  let fixture: ComponentFixture<MemberretireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberretireComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberretireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
