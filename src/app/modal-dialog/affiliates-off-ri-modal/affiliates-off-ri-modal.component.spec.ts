import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliatesOffRIModalComponent } from './affiliates-off-ri-modal.component';

describe('AffiliatesOffRIModalComponent', () => {
  let component: AffiliatesOffRIModalComponent;
  let fixture: ComponentFixture<AffiliatesOffRIModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AffiliatesOffRIModalComponent]
    });
    fixture = TestBed.createComponent(AffiliatesOffRIModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
