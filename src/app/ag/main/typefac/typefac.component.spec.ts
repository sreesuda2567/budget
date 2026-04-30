import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypefacComponent } from './typefac.component';

describe('TypefacComponent', () => {
  let component: TypefacComponent;
  let fixture: ComponentFixture<TypefacComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypefacComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypefacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
