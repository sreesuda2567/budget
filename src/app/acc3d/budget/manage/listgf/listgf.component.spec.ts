import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListgfComponent } from './listgf.component';

describe('ListgfComponent', () => {
  let component: ListgfComponent;
  let fixture: ComponentFixture<ListgfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListgfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListgfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
