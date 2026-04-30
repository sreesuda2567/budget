import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgsignatureComponent } from './agsignature.component';

describe('AgsignatureComponent', () => {
  let component: AgsignatureComponent;
  let fixture: ComponentFixture<AgsignatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgsignatureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgsignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
