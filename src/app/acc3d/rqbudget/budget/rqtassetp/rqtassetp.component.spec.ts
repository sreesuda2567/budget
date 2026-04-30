import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RqtassetpComponent } from './rqtassetp.component';

describe('RqtassetpComponent', () => {
  let component: RqtassetpComponent;
  let fixture: ComponentFixture<RqtassetpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RqtassetpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RqtassetpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
