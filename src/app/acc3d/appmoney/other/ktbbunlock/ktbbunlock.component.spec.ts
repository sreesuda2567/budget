import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KtbbunlockComponent } from './ktbbunlock.component';

describe('KtbbunlockComponent', () => {
  let component: KtbbunlockComponent;
  let fixture: ComponentFixture<KtbbunlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KtbbunlockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KtbbunlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
