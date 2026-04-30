import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpmedicalretireComponent } from './epmedicalretire.component';

describe('EpmedicalretireComponent', () => {
  let component: EpmedicalretireComponent;
  let fixture: ComponentFixture<EpmedicalretireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EpmedicalretireComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EpmedicalretireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
