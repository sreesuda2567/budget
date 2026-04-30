import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnalsendComponent } from './annalsend.component';

describe('AnnalsendComponent', () => {
  let component: AnnalsendComponent;
  let fixture: ComponentFixture<AnnalsendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnalsendComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnalsendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
