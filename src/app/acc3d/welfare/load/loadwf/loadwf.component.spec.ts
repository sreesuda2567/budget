import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadwfComponent } from './loadwf.component';

describe('LoadwfComponent', () => {
  let component: LoadwfComponent;
  let fixture: ComponentFixture<LoadwfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadwfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadwfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
