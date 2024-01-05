import { TestBed } from '@angular/core/testing';

import { EditUserAccessService } from './edit-user-access.service';

describe('EditUserAccessService', () => {
  let service: EditUserAccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditUserAccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
