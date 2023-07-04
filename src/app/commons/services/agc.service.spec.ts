import { TestBed } from '@angular/core/testing';

import { AgcService } from './agc.service';

describe('AgcService', () => {
  let service: AgcService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
