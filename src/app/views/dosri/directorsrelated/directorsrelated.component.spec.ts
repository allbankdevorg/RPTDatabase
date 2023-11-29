import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectorsrelatedComponent } from './directorsrelated.component';

describe('DirectorsrelatedComponent', () => {
  let component: DirectorsrelatedComponent;
  let fixture: ComponentFixture<DirectorsrelatedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DirectorsrelatedComponent]
    });
    fixture = TestBed.createComponent(DirectorsrelatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
