import { TestBed } from '@angular/core/testing';

import { DirRIService } from './dir-ri.service';

describe('DirRIService', () => {
  let service: DirRIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DirRIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
