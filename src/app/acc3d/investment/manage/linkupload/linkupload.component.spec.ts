import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkuploadComponent } from './linkupload.component';

describe('LinkuploadComponent', () => {
  let component: LinkuploadComponent;
  let fixture: ComponentFixture<LinkuploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkuploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkuploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
