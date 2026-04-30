import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporaccComponent } from './reporacc.component';

describe('ReporaccComponent', () => {
  let component: ReporaccComponent;
  let fixture: ComponentFixture<ReporaccComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporaccComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporaccComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
