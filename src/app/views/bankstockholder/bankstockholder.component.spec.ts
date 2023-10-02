import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankstockholderComponent } from './bankstockholder.component';

describe('BankstockholderComponent', () => {
  let component: BankstockholderComponent;
  let fixture: ComponentFixture<BankstockholderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BankstockholderComponent]
    });
    fixture = TestBed.createComponent(BankstockholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
