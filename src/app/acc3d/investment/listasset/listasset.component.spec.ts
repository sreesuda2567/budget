import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListassetComponent } from './listasset.component';

describe('ListassetComponent', () => {
  let component: ListassetComponent;
  let fixture: ComponentFixture<ListassetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListassetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListassetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
