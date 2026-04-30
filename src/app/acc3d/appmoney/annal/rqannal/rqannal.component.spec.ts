import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RqannalComponent } from './rqannal.component';

describe('RqannalComponent', () => {
  let component: RqannalComponent;
  let fixture: ComponentFixture<RqannalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RqannalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RqannalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
