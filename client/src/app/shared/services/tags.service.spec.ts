import { TestBed } from '@angular/core/testing';
import { TagsService } from './tags.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TagInterface } from '../models/interfaces/tag.interface';

describe('TagsService', () => {
  let service: TagsService;
  let httpController: HttpTestingController;
  const mockTag: TagInterface = {
    id: 'b0c8012b-156d-425c-8b96-aa99e49d92a1',
    value: 'Tag',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(TagsService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllTags', () => {
    it('should send request', () => {
      const expectedResult: TagInterface[] = [mockTag];
      service.getAllTags().subscribe((result) => {
        expect(result).toBe(expectedResult);
      });

      const req = httpController.expectOne(`${service.baseUrl}`);
      expect(req.request.method).toBe('GET');
      req.flush(expectedResult);
    });
  });

  describe('createTag', () => {
    it('should send request', () => {
      const tag = 'New tag';
      const expectedResult: TagInterface = mockTag;
      service.createTag(tag).subscribe((result) => {
        expect(result).toBe(expectedResult);
      });

      const req = httpController.expectOne(`${service.baseUrl}`);
      expect(req.request.method).toBe('POST');
      req.flush(expectedResult);
    });
  });

  describe('removeTag', () => {
    it('should send request', () => {
      const id = '35c90c0b-ba58-46f3-a091-bcdf66f514a8';
      service.removeTag(id).subscribe();

      const req = httpController.expectOne(`${service.baseUrl}/${id}`);
      expect(req.request.method).toBe('DELETE');
    });
  });

  describe('createTag', () => {
    it('should send request', () => {
      const tag = 'New tag';
      const id = '35c90c0b-ba58-46f3-a091-bcdf66f514a8';
      const expectedResult: TagInterface = mockTag;
      service.updateTag(id, tag).subscribe((result) => {
        expect(result).toBe(expectedResult);
      });

      const req = httpController.expectOne(`${service.baseUrl}/${id}`);
      expect(req.request.method).toBe('PUT');
      req.flush(expectedResult);
    });
  });
});
