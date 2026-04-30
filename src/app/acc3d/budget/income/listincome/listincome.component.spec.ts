import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListincomeComponent } from './listincome.component';

describe('ListincomeComponent', () => {
  let component: ListincomeComponent;
  let fixture: ComponentFixture<ListincomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListincomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListincomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
