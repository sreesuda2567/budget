import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadwComponent } from './loadw.component';

describe('LoadwComponent', () => {
  let component: LoadwComponent;
  let fixture: ComponentFixture<LoadwComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadwComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadwComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
