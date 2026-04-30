import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WfdashboardComponent } from './wfdashboard.component';

describe('WfdashboardComponent', () => {
  let component: WfdashboardComponent;
  let fixture: ComponentFixture<WfdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WfdashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WfdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
