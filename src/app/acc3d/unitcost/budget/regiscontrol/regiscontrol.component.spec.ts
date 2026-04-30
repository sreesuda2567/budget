import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegiscontrolComponent } from './regiscontrol.component';

describe('RegiscontrolComponent', () => {
  let component: RegiscontrolComponent;
  let fixture: ComponentFixture<RegiscontrolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegiscontrolComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegiscontrolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
