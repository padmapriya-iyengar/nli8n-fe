import { TestBed } from '@angular/core/testing';

import { MigrationService } from './migration.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

describe('MigrationService', () => {
  let service: MigrationService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MigrationService]
    });
    service = TestBed.inject(MigrationService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
