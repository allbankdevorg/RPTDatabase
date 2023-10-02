import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PRIComponent } from './pri.component';

describe('PRIComponent', () => {
  let component: PRIComponent;
  let fixture: ComponentFixture<PRIComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PRIComponent]
    });
    fixture = TestBed.createComponent(PRIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
