import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FregiscontrolComponent } from './fregiscontrol.component';

describe('FregiscontrolComponent', () => {
  let component: FregiscontrolComponent;
  let fixture: ComponentFixture<FregiscontrolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FregiscontrolComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FregiscontrolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
