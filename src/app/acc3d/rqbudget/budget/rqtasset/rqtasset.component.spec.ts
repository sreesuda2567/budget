import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RqtassetComponent } from './rqtasset.component';

describe('RqtassetComponent', () => {
  let component: RqtassetComponent;
  let fixture: ComponentFixture<RqtassetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RqtassetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RqtassetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
