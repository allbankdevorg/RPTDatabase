import { TestBed } from '@angular/core/testing';

import { HoldOutService } from './hold-out.service';

describe('HoldOutService', () => {
  let service: HoldOutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HoldOutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
