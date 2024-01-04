import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateManagingCompanyModalComponent } from './update-managing-company-modal.component';

describe('UpdateManagingCompanyModalComponent', () => {
  let component: UpdateManagingCompanyModalComponent;
  let fixture: ComponentFixture<UpdateManagingCompanyModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateManagingCompanyModalComponent]
    });
    fixture = TestBed.createComponent(UpdateManagingCompanyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
