import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliatesDirRIModalComponent } from './affiliates-dir-ri-modal.component';

describe('AffiliatesDirRIModalComponent', () => {
  let component: AffiliatesDirRIModalComponent;
  let fixture: ComponentFixture<AffiliatesDirRIModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AffiliatesDirRIModalComponent]
    });
    fixture = TestBed.createComponent(AffiliatesDirRIModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
