import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadlinkComponent } from './uploadlink.component';

describe('UploadlinkComponent', () => {
  let component: UploadlinkComponent;
  let fixture: ComponentFixture<UploadlinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadlinkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadlinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
