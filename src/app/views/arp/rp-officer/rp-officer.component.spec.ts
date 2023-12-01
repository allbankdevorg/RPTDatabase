import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RpOfficerComponent } from './rp-officer.component';

describe('RpOfficerComponent', () => {
  let component: RpOfficerComponent;
  let fixture: ComponentFixture<RpOfficerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RpOfficerComponent]
    });
    fixture = TestBed.createComponent(RpOfficerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
