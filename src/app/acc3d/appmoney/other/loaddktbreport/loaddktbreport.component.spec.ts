import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaddktbreportComponent } from './loaddktbreport.component';

describe('LoaddktbreportComponent', () => {
  let component: LoaddktbreportComponent;
  let fixture: ComponentFixture<LoaddktbreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoaddktbreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoaddktbreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
