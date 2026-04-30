import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectmoreComponent } from './projectmore.component';

describe('ProjectmoreComponent', () => {
  let component: ProjectmoreComponent;
  let fixture: ComponentFixture<ProjectmoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectmoreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectmoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
