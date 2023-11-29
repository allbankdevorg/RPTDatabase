import { TestBed } from '@angular/core/testing';

import { AddServicesService } from './add-services.service';

describe('AddServicesService', () => {
  let service: AddServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
