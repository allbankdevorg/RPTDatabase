import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RpOfficerRIComponent } from './rp-officer-ri.component';

describe('RpOfficerRIComponent', () => {
  let component: RpOfficerRIComponent;
  let fixture: ComponentFixture<RpOfficerRIComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RpOfficerRIComponent]
    });
    fixture = TestBed.createComponent(RpOfficerRIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
