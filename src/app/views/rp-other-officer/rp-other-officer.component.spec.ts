import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RpOtherOfficerComponent } from './rp-other-officer.component';

describe('RpOtherOfficerComponent', () => {
  let component: RpOtherOfficerComponent;
  let fixture: ComponentFixture<RpOtherOfficerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RpOtherOfficerComponent]
    });
    fixture = TestBed.createComponent(RpOtherOfficerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
