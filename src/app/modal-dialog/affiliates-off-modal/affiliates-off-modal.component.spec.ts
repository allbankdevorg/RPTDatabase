import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliatesOffModalComponent } from './affiliates-off-modal.component';

describe('AffiliatesOffModalComponent', () => {
  let component: AffiliatesOffModalComponent;
  let fixture: ComponentFixture<AffiliatesOffModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AffiliatesOffModalComponent]
    });
    fixture = TestBed.createComponent(AffiliatesOffModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
