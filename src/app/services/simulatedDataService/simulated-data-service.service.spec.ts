import { TestBed } from '@angular/core/testing';

import { SimulatedDataServiceService } from './simulated-data-service.service';

describe('SimulatedDataServiceService', () => {
  let service: SimulatedDataServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SimulatedDataServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
