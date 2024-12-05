import { TestBed } from '@angular/core/testing';

import { OrptService } from './orpt.service';

describe('OrptService', () => {
  let service: OrptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
