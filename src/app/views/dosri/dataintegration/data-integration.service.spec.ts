import { TestBed } from '@angular/core/testing';

import { DataIntegrationService } from './data-integration.service';

describe('DataIntegrationService', () => {
  let service: DataIntegrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataIntegrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
