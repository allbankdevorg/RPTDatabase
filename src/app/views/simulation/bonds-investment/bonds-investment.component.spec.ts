import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BondsInvestmentComponent } from './bonds-investment.component';

describe('BondsInvestmentComponent', () => {
  let component: BondsInvestmentComponent;
  let fixture: ComponentFixture<BondsInvestmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BondsInvestmentComponent]
    });
    fixture = TestBed.createComponent(BondsInvestmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
