import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliatesDirModalComponent } from './affiliates-dir-modal.component';

describe('AffiliatesDirModalComponent', () => {
  let component: AffiliatesDirModalComponent;
  let fixture: ComponentFixture<AffiliatesDirModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AffiliatesDirModalComponent]
    });
    fixture = TestBed.createComponent(AffiliatesDirModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
