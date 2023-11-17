import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherRelatedCompaniesComponent } from './other-related-companies.component';

describe('OtherRelatedCompaniesComponent', () => {
  let component: OtherRelatedCompaniesComponent;
  let fixture: ComponentFixture<OtherRelatedCompaniesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OtherRelatedCompaniesComponent]
    });
    fixture = TestBed.createComponent(OtherRelatedCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
