import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuwelfareComponent } from './menuwelfare.component';

describe('MenuwelfareComponent', () => {
  let component: MenuwelfareComponent;
  let fixture: ComponentFixture<MenuwelfareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuwelfareComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuwelfareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
