import { TestBed } from '@angular/core/testing';

import { SimulatedSBLDataService } from './simulated-sbldata.service';

describe('SimulatedSBLDataService', () => {
  let service: SimulatedSBLDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SimulatedSBLDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
