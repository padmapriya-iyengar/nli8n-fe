import { TestBed } from '@angular/core/testing';

import { UtilitiesService } from './utilities.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';

describe('UtilitiesService', () => {
  let service: UtilitiesService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UtilitiesService, MessageService, DatePipe]
    });
    service = TestBed.inject(UtilitiesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
