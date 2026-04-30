import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearchecktComponent } from './clearcheckt.component';

describe('ClearchecktComponent', () => {
  let component: ClearchecktComponent;
  let fixture: ComponentFixture<ClearchecktComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClearchecktComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClearchecktComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
