import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollwassetComponent } from './follwasset.component';

describe('FollwassetComponent', () => {
  let component: FollwassetComponent;
  let fixture: ComponentFixture<FollwassetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollwassetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FollwassetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
