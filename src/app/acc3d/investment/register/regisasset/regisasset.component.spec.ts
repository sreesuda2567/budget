import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisassetComponent } from './regisasset.component';

describe('RegisassetComponent', () => {
  let component: RegisassetComponent;
  let fixture: ComponentFixture<RegisassetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisassetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisassetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
