import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatrComponent } from './formatr.component';

describe('FormatrComponent', () => {
  let component: FormatrComponent;
  let fixture: ComponentFixture<FormatrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormatrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormatrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
