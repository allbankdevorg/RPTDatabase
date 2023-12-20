import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliatesModalComponent } from './affiliates-modal.component';

describe('AffiliatesModalComponent', () => {
  let component: AffiliatesModalComponent;
  let fixture: ComponentFixture<AffiliatesModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AffiliatesModalComponent]
    });
    fixture = TestBed.createComponent(AffiliatesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
