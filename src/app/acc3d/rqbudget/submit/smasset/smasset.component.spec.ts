import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmassetComponent } from './smasset.component';

describe('SmassetComponent', () => {
  let component: SmassetComponent;
  let fixture: ComponentFixture<SmassetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmassetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmassetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
