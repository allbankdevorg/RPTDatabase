import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RpRelatedCompaniesComponent } from './rp-related-companies.component';

describe('RpRelatedCompaniesComponent', () => {
  let component: RpRelatedCompaniesComponent;
  let fixture: ComponentFixture<RpRelatedCompaniesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RpRelatedCompaniesComponent]
    });
    fixture = TestBed.createComponent(RpRelatedCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
