import { TestBed } from '@angular/core/testing';

import { WebsocketService } from './websocket.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

describe('WebsocketService', () => {
  let service: WebsocketService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WebsocketService]
    });
    service = TestBed.inject(WebsocketService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
