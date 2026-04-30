import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsprojectComponent } from './insproject.component';

describe('InsprojectComponent', () => {
  let component: InsprojectComponent;
  let fixture: ComponentFixture<InsprojectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsprojectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsprojectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
