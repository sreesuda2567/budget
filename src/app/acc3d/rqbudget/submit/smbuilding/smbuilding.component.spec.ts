import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmbuildingComponent } from './smbuilding.component';

describe('SmbuildingComponent', () => {
  let component: SmbuildingComponent;
  let fixture: ComponentFixture<SmbuildingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmbuildingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmbuildingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
