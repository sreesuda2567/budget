import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditorComponent } from './creditor.component';

describe('CreditorComponent', () => {
  let component: CreditorComponent;
  let fixture: ComponentFixture<CreditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
