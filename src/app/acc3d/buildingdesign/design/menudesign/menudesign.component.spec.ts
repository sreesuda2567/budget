import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenudesignComponent } from './menudesign.component';

describe('MenudesignComponent', () => {
  let component: MenudesignComponent;
  let fixture: ComponentFixture<MenudesignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenudesignComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenudesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
