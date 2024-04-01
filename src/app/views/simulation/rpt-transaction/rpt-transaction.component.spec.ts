import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RptTransactionComponent } from './rpt-transaction.component';

describe('RptTransactionComponent', () => {
  let component: RptTransactionComponent;
  let fixture: ComponentFixture<RptTransactionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RptTransactionComponent]
    });
    fixture = TestBed.createComponent(RptTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
