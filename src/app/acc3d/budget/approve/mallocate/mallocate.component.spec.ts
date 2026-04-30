import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MallocateComponent } from './mallocate.component';

describe('MallocateComponent', () => {
  let component: MallocateComponent;
  let fixture: ComponentFixture<MallocateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MallocateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MallocateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
