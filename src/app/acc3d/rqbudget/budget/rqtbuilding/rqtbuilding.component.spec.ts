import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RqtbuildingComponent } from './rqtbuilding.component';

describe('RqtbuildingComponent', () => {
  let component: RqtbuildingComponent;
  let fixture: ComponentFixture<RqtbuildingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RqtbuildingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RqtbuildingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
