import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavemoneyComponent } from './savemoney.component';

describe('SavemoneyComponent', () => {
  let component: SavemoneyComponent;
  let fixture: ComponentFixture<SavemoneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavemoneyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavemoneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
