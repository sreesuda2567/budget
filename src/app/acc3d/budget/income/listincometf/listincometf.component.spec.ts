import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListincometfComponent } from './listincometf.component';

describe('ListincometfComponent', () => {
  let component: ListincometfComponent;
  let fixture: ComponentFixture<ListincometfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListincometfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListincometfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
