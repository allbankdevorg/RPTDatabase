import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RpAffiliatesComponent } from './rp-affiliates.component';

describe('RpAffiliatesComponent', () => {
  let component: RpAffiliatesComponent;
  let fixture: ComponentFixture<RpAffiliatesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RpAffiliatesComponent]
    });
    fixture = TestBed.createComponent(RpAffiliatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
