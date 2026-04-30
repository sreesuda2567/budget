import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaddktbannalComponent } from './loaddktbannal.component';

describe('LoaddktbannalComponent', () => {
  let component: LoaddktbannalComponent;
  let fixture: ComponentFixture<LoaddktbannalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoaddktbannalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoaddktbannalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
