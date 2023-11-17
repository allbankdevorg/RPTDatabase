import { TestBed } from '@angular/core/testing';

import { OrgsDataServicesService } from './orgs-data-services.service';

describe('OrgsDataServicesService', () => {
  let service: OrgsDataServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrgsDataServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
