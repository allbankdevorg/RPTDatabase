import { TestBed } from '@angular/core/testing';

import { AffilDIRService } from './affil-dir.service';

describe('AffilDIRService', () => {
  let service: AffilDIRService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AffilDIRService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
