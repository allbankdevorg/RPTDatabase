import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaseContractsComponent } from './lease-contracts.component';

describe('LeaseContractsComponent', () => {
  let component: LeaseContractsComponent;
  let fixture: ComponentFixture<LeaseContractsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeaseContractsComponent]
    });
    fixture = TestBed.createComponent(LeaseContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
