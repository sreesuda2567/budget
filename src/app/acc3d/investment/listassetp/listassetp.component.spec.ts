import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListassetpComponent } from './listassetp.component';

describe('ListassetpComponent', () => {
  let component: ListassetpComponent;
  let fixture: ComponentFixture<ListassetpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListassetpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListassetpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
