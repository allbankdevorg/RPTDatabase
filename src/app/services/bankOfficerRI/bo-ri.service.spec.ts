import { TestBed } from '@angular/core/testing';

import { BoRIService } from './bo-ri.service';

describe('BoRIService', () => {
  let service: BoRIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoRIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
