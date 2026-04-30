import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocateaccComponent } from './allocateacc.component';

describe('AllocateaccComponent', () => {
  let component: AllocateaccComponent;
  let fixture: ComponentFixture<AllocateaccComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllocateaccComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllocateaccComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
