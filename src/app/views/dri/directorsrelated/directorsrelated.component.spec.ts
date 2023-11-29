import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectorsrelatedComponents } from './directorsrelated.component';

describe('DirectorsrelatedComponent', () => {
  let component: DirectorsrelatedComponents;
  let fixture: ComponentFixture<DirectorsrelatedComponents>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DirectorsrelatedComponents]
    });
    fixture = TestBed.createComponent(DirectorsrelatedComponents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
