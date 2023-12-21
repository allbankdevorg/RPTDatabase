import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliatesRPModalComponent } from './affiliates-rpmodal.component';

describe('AffiliatesRPModalComponent', () => {
  let component: AffiliatesRPModalComponent;
  let fixture: ComponentFixture<AffiliatesRPModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AffiliatesRPModalComponent]
    });
    fixture = TestBed.createComponent(AffiliatesRPModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
