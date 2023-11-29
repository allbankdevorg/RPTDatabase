import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliatesRelatedCompaniesComponent } from './affiliates-related-companies.component';

describe('AffiliatesRelatedCompaniesComponent', () => {
  let component: AffiliatesRelatedCompaniesComponent;
  let fixture: ComponentFixture<AffiliatesRelatedCompaniesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AffiliatesRelatedCompaniesComponent]
    });
    fixture = TestBed.createComponent(AffiliatesRelatedCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
