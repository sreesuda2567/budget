import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListbuildingComponent } from './listbuilding.component';

describe('ListbuildingComponent', () => {
  let component: ListbuildingComponent;
  let fixture: ComponentFixture<ListbuildingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListbuildingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListbuildingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
