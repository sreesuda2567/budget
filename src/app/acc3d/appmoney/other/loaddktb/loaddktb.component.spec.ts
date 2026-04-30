import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaddktbComponent } from './loaddktb.component';

describe('LoaddktbComponent', () => {
  let component: LoaddktbComponent;
  let fixture: ComponentFixture<LoaddktbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoaddktbComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoaddktbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
