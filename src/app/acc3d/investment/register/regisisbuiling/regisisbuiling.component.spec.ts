import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisisbuilingComponent } from './regisisbuiling.component';

describe('RegisisbuilingComponent', () => {
  let component: RegisisbuilingComponent;
  let fixture: ComponentFixture<RegisisbuilingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisisbuilingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisisbuilingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
