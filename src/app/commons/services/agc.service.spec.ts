import { TestBed, getTestBed } from '@angular/core/testing';

import { AgcService } from './agc.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { api } from 'src/config/api-url';
import { DATA } from 'src/test-data/data';

describe('AGC Service', () => {
  let service: AgcService;
  let injector: TestBed
  let httpTestingController: HttpTestingController;

  const apiURL:any = api;
  const apiEndpoint: any = environment.api_endpoint;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AgcService]
    });
    injector = getTestBed()
    service = injector.inject(AgcService);
    httpTestingController = injector.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Get Master Data by Type', ()=>{
    it('AGENCY_NAME_FOREIGN', ()=>{
      let param = 'AGENCY_NAME_FOREIGN'
      let obj:any = DATA.MASTER.TYPE.find(el => el.name == param)?.value
      service.getMasterDataByType(param).subscribe({next: mdata => {
          expect(mdata).toEqual(obj)
        }
      })
      const req = httpTestingController.expectOne(apiEndpoint + apiURL.get_master_data+'?source=type&identifier='+param);
      expect(req.request.method).toBe('GET');
      req.flush(obj);
    })
    it('AGENCY_TYPE_FOREIGN', ()=>{
      let param = 'AGENCY_TYPE_FOREIGN'
      let obj:any = DATA.MASTER.TYPE.find(el => el.name == param)?.value
      service.getMasterDataByType(param).subscribe({next: mdata => {
          expect(mdata).toEqual(obj)
        }
      })
      const req = httpTestingController.expectOne(apiEndpoint + apiURL.get_master_data+'?source=type&identifier='+param);
      expect(req.request.method).toBe('GET');
      req.flush(obj);
    })
    it('CASE_ACTIVITY_TYPE', ()=>{
      let param = 'CASE_ACTIVITY_TYPE'
      let obj:any = DATA.MASTER.TYPE.find(el => el.name == param)?.value
      service.getMasterDataByType(param).subscribe({next: mdata => {
          expect(mdata).toEqual(obj)
        }
      })
      const req = httpTestingController.expectOne(apiEndpoint + apiURL.get_master_data+'?source=type&identifier='+param);
      expect(req.request.method).toBe('GET');
      req.flush(obj);
    })
    it('CASE_COMPLEXITY', ()=>{
      let param = 'CASE_COMPLEXITY'
      let obj:any = DATA.MASTER.TYPE.find(el => el.name == param)?.value
      service.getMasterDataByType(param).subscribe({next: mdata => {
          expect(mdata).toEqual(obj)
        }
      })
      const req = httpTestingController.expectOne(apiEndpoint + apiURL.get_master_data+'?source=type&identifier='+param);
      expect(req.request.method).toBe('GET');
      req.flush(obj);
    })
    it('CASE_FATF', ()=>{
      let param = 'CASE_FATF'
      let obj:any = DATA.MASTER.TYPE.find(el => el.name == param)?.value
      service.getMasterDataByType(param).subscribe({next: mdata => {
          expect(mdata).toEqual(obj)
        }
      })
      const req = httpTestingController.expectOne(apiEndpoint + apiURL.get_master_data+'?source=type&identifier='+param);
      expect(req.request.method).toBe('GET');
      req.flush(obj);
    })
    it('CASE_STATUS', ()=>{
      let param = 'CASE_STATUS'
      let obj:any = DATA.MASTER.TYPE.find(el => el.name == param)?.value
      service.getMasterDataByType(param).subscribe({next: mdata => {
          expect(mdata).toEqual(obj)
        }
      })
      const req = httpTestingController.expectOne(apiEndpoint + apiURL.get_master_data+'?source=type&identifier='+param);
      expect(req.request.method).toBe('GET');
      req.flush(obj);
    })
    it('COUNTRY', ()=>{
      let param = 'COUNTRY'
      let obj:any = DATA.MASTER.TYPE.find(el => el.name == param)?.value
      service.getMasterDataByType(param).subscribe({next: mdata => {
          expect(mdata).toEqual(obj)
        }
      })
      const req = httpTestingController.expectOne(apiEndpoint + apiURL.get_master_data+'?source=type&identifier='+param);
      expect(req.request.method).toBe('GET');
      req.flush(obj);
    })
    it('DEPARTMENT', ()=>{
      let param = 'DEPARTMENT'
      let obj:any = DATA.MASTER.TYPE.find(el => el.name == param)?.value
      service.getMasterDataByType(param).subscribe({next: mdata => {
          expect(mdata).toEqual(obj)
        }
      })
      const req = httpTestingController.expectOne(apiEndpoint + apiURL.get_master_data+'?source=type&identifier='+param);
      expect(req.request.method).toBe('GET');
      req.flush(obj);
    })
    it('DOCUMENT_TYPE', ()=>{
      let param = 'DOCUMENT_TYPE'
      let obj:any = DATA.MASTER.TYPE.find(el => el.name == param)?.value
      service.getMasterDataByType(param).subscribe({next: mdata => {
          expect(mdata).toEqual(obj)
        }
      })
      const req = httpTestingController.expectOne(apiEndpoint + apiURL.get_master_data+'?source=type&identifier='+param);
      expect(req.request.method).toBe('GET');
      req.flush(obj);
    })
    it('EXTERNAL_AGENCY_NAME', ()=>{
      let param = 'EXTERNAL_AGENCY_NAME'
      let obj:any = DATA.MASTER.TYPE.find(el => el.name == param)?.value
      service.getMasterDataByType(param).subscribe({next: mdata => {
          expect(mdata).toEqual(obj)
        }
      })
      const req = httpTestingController.expectOne(apiEndpoint + apiURL.get_master_data+'?source=type&identifier='+param);
      expect(req.request.method).toBe('GET');
      req.flush(obj);
    })
    it('EXTERNAL_AGENCY_TYPE', ()=>{
      let param = 'EXTERNAL_AGENCY_TYPE'
      let obj:any = DATA.MASTER.TYPE.find(el => el.name == param)?.value
      service.getMasterDataByType(param).subscribe({next: mdata => {
          expect(mdata).toEqual(obj)
        }
      })
      const req = httpTestingController.expectOne(apiEndpoint + apiURL.get_master_data+'?source=type&identifier='+param);
      expect(req.request.method).toBe('GET');
      req.flush(obj);
    })
    it('FILE_DIVISION', ()=>{
      let param = 'FILE_DIVISION'
      let obj:any = DATA.MASTER.TYPE.find(el => el.name == param)?.value
      service.getMasterDataByType(param).subscribe({next: mdata => {
          expect(mdata).toEqual(obj)
        }
      })
      const req = httpTestingController.expectOne(apiEndpoint + apiURL.get_master_data+'?source=type&identifier='+param);
      expect(req.request.method).toBe('GET');
      req.flush(obj);
    })
    it('FILE_HEADER1', ()=>{
      let param = 'FILE_HEADER1'
      let obj:any = DATA.MASTER.TYPE.find(el => el.name == param)?.value
      service.getMasterDataByType(param).subscribe({next: mdata => {
          expect(mdata).toEqual(obj)
        }
      })
      const req = httpTestingController.expectOne(apiEndpoint + apiURL.get_master_data+'?source=type&identifier='+param);
      expect(req.request.method).toBe('GET');
      req.flush(obj);
    })
    it('FILE_HEADER2', ()=>{
      let param = 'FILE_HEADER2'
      let obj:any = DATA.MASTER.TYPE.find(el => el.name == param)?.value
      service.getMasterDataByType(param).subscribe({next: mdata => {
          expect(mdata).toEqual(obj)
        }
      })
      const req = httpTestingController.expectOne(apiEndpoint + apiURL.get_master_data+'?source=type&identifier='+param);
      expect(req.request.method).toBe('GET');
      req.flush(obj);
    })
    it('FILE_ORIGIN', ()=>{
      let param = 'FILE_ORIGIN'
      let obj:any = DATA.MASTER.TYPE.find(el => el.name == param)?.value
      service.getMasterDataByType(param).subscribe({next: mdata => {
          expect(mdata).toEqual(obj)
        }
      })
      const req = httpTestingController.expectOne(apiEndpoint + apiURL.get_master_data+'?source=type&identifier='+param);
      expect(req.request.method).toBe('GET');
      req.flush(obj);
    })
    it('FILE_YEAR', ()=>{
      let param = 'FILE_YEAR'
      let obj:any = DATA.MASTER.TYPE.find(el => el.name == param)?.value
      service.getMasterDataByType(param).subscribe({next: mdata => {
          expect(mdata).toEqual(obj)
        }
      })
      const req = httpTestingController.expectOne(apiEndpoint + apiURL.get_master_data+'?source=type&identifier='+param);
      expect(req.request.method).toBe('GET');
      req.flush(obj);
    })
    it('MLA_CASE_SUB_TYPE', ()=>{
      let param = 'MLA_CASE_SUB_TYPE'
      let obj:any = DATA.MASTER.TYPE.find(el => el.name == param)?.value
      service.getMasterDataByType(param).subscribe({next: mdata => {
          expect(mdata).toEqual(obj)
        }
      })
      const req = httpTestingController.expectOne(apiEndpoint + apiURL.get_master_data+'?source=type&identifier='+param);
      expect(req.request.method).toBe('GET');
      req.flush(obj);
    })
    it('MLA_CASE_TYPE', ()=>{
      let param = 'MLA_CASE_TYPE'
      let obj:any = DATA.MASTER.TYPE.find(el => el.name == param)?.value
      service.getMasterDataByType(param).subscribe({next: mdata => {
          expect(mdata).toEqual(obj)
        }
      })
      const req = httpTestingController.expectOne(apiEndpoint + apiURL.get_master_data+'?source=type&identifier='+param);
      expect(req.request.method).toBe('GET');
      req.flush(obj);
    })
    it('REQUEST_COMPLEXITY', ()=>{
      let param = 'REQUEST_COMPLEXITY'
      let obj:any = DATA.MASTER.TYPE.find(el => el.name == param)?.value
      service.getMasterDataByType(param).subscribe({next: mdata => {
          expect(mdata).toEqual(obj)
        }
      })
      const req = httpTestingController.expectOne(apiEndpoint + apiURL.get_master_data+'?source=type&identifier='+param);
      expect(req.request.method).toBe('GET');
      req.flush(obj);
    })
    it('REQUEST_MODE', ()=>{
      let param = 'REQUEST_MODE'
      let obj:any = DATA.MASTER.TYPE.find(el => el.name == param)?.value
      service.getMasterDataByType(param).subscribe({next: mdata => {
          expect(mdata).toEqual(obj)
        }
      })
      const req = httpTestingController.expectOne(apiEndpoint + apiURL.get_master_data+'?source=type&identifier='+param);
      expect(req.request.method).toBe('GET');
      req.flush(obj);
    })
    it('REQUEST_STATUS', ()=>{
      let param = 'REQUEST_STATUS'
      let obj:any = DATA.MASTER.TYPE.find(el => el.name == param)?.value
      service.getMasterDataByType(param).subscribe({next: mdata => {
          expect(mdata).toEqual(obj)
        }
      })
      const req = httpTestingController.expectOne(apiEndpoint + apiURL.get_master_data+'?source=type&identifier='+param);
      expect(req.request.method).toBe('GET');
      req.flush(obj);
    })
    it('REQUEST_TYPE', ()=>{
      let param = 'REQUEST_TYPE'
      let obj:any = DATA.MASTER.TYPE.find(el => el.name == param)?.value
      service.getMasterDataByType(param).subscribe({next: mdata => {
          expect(mdata).toEqual(obj)
        }
      })
      const req = httpTestingController.expectOne(apiEndpoint + apiURL.get_master_data+'?source=type&identifier='+param);
      expect(req.request.method).toBe('GET');
      req.flush(obj);
    })
    it('REQUEST_URGENCY', ()=>{
      let param = 'REQUEST_URGENCY'
      let obj:any = DATA.MASTER.TYPE.find(el => el.name == param)?.value
      service.getMasterDataByType(param).subscribe({next: mdata => {
          expect(mdata).toEqual(obj)
        }
      })
      const req = httpTestingController.expectOne(apiEndpoint + apiURL.get_master_data+'?source=type&identifier='+param);
      expect(req.request.method).toBe('GET');
      req.flush(obj);
    })
    it('REQUESTED_UNDER', ()=>{
      let param = 'REQUESTED_UNDER'
      let obj:any = DATA.MASTER.TYPE.find(el => el.name == param)?.value
      service.getMasterDataByType(param).subscribe({next: mdata => {
          expect(mdata).toEqual(obj)
        }
      })
      const req = httpTestingController.expectOne(apiEndpoint + apiURL.get_master_data+'?source=type&identifier='+param);
      expect(req.request.method).toBe('GET');
      req.flush(obj);
    })
    it('ROOT_CODE', ()=>{
      let param = 'ROOT_CODE'
      let obj:any = DATA.MASTER.TYPE.find(el => el.name == param)?.value
      service.getMasterDataByType(param).subscribe({next: mdata => {
          expect(mdata).toEqual(obj)
        }
      })
      const req = httpTestingController.expectOne(apiEndpoint + apiURL.get_master_data+'?source=type&identifier='+param);
      expect(req.request.method).toBe('GET');
      req.flush(obj);
    })
    it('SECURITY_CLASSIFICATION', ()=>{
      let param = 'SECURITY_CLASSIFICATION'
      let obj:any = DATA.MASTER.TYPE.find(el => el.name == param)?.value
      service.getMasterDataByType(param).subscribe({next: mdata => {
          expect(mdata).toEqual(obj)
        }
      })
      const req = httpTestingController.expectOne(apiEndpoint + apiURL.get_master_data+'?source=type&identifier='+param);
      expect(req.request.method).toBe('GET');
      req.flush(obj);
    })
  })
  describe('Get Master Data by Types', () => {
    it('ALL_TYPES', () => {
      let param = 'AGENCY_NAME_FOREIGN, AGENCY_TYPE_FOREIGN,'+ 
      'CASE_ACTIVITY_TYPE, CASE_COMPLEXITY, CASE_FATF, CASE_STATUS, COUNTRY, DEPARTMENT, DOCUMENT_TYPE, EXTERNAL_AGENCY_NAME, EXTERNAL_AGENCY_TYPE,'+ 
      'FILE_DIVISION, FILE_HEADER1, FILE_HEADER2, FILE_ORIGIN, FILE_YEAR, MLA_CASE_SUB_TYPE, MLA_CASE_TYPE, REQUEST_COMPLEXITY, REQUEST_MODE,'+ 
      'REQUEST_STATUS, REQUEST_TYPE, REQUEST_URGENCY, REQUESTED_UNDER, ROOT_CODE, SECURITY_CLASSIFICATION'
      let obj:any = DATA.MASTER.TYPES.find(el => el.name == 'ALL_TYPES')?.value
      service.getMasterDataByTypes(param).subscribe({next: mdata => {
          expect(mdata).toEqual(obj)
        }
      })
      const req = httpTestingController.expectOne(apiEndpoint + apiURL.get_master_data+'?source=types&identifier='+param);
      expect(req.request.method).toBe('GET');
      req.flush(obj);
    })
  })
})
