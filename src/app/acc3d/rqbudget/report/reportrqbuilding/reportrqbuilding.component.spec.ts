import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportrqbuildingComponent } from './reportrqbuilding.component';

describe('ReportrqbuildingComponent', () => {
  let component: ReportrqbuildingComponent;
  let fixture: ComponentFixture<ReportrqbuildingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportrqbuildingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportrqbuildingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
