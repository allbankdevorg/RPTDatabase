import { TestBed } from '@angular/core/testing';

import { AffiliatesService } from './affiliates.service';

describe('AffiliatesService', () => {
  let service: AffiliatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AffiliatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
