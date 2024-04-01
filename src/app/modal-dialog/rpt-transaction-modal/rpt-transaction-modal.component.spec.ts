import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RptTransactionModalComponent } from './rpt-transaction-modal.component';

describe('RptTransactionModalComponent', () => {
  let component: RptTransactionModalComponent;
  let fixture: ComponentFixture<RptTransactionModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RptTransactionModalComponent]
    });
    fixture = TestBed.createComponent(RptTransactionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
