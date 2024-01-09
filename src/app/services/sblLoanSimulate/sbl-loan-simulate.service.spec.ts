import { TestBed } from '@angular/core/testing';

import { SblLoanSimulateService } from './sbl-loan-simulate.service';

describe('SblLoanSimulateService', () => {
  let service: SblLoanSimulateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SblLoanSimulateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
