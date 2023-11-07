import { TestBed } from '@angular/core/testing';

import { CommentsService } from './comments.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { CommentWithDescendantsInterface } from '../models/interfaces/comment-with-descendants.interface';
import { CreateCommentDataInterface } from '../models/interfaces/create-comment-data.interface';
import { CommentInterface } from '../models/interfaces/comment.interface';

describe('CommentsService', () => {
  let service: CommentsService;
  let httpController: HttpTestingController;
  const newComment: CommentInterface = {
    id: 'f81361ca-d151-4111-9233-49d8cd5d116c',
    content: 'comment',
    createdAt: '',
    updatedAt: '',
    likesUsersIds: [],
    dislikesUsersIds: [],
    user: {
      id: '35c90c0b-ba58-46f3-a091-bcdf66f514a8',
      email: 'mail@mail.mail',
      password: 'Pa$$word094',
      firstName: 'John',
      lastName: 'Doe',
      fullName: 'John Doe',
      isAdmin: true,
      photo: null,
    },
  };
  const mockComment: CommentWithDescendantsInterface = {
    ...newComment,
    descendantsList: [],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(CommentsService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCommentsList', () => {
    it('should send request', () => {
      const articleId = '23a54326-57d8-41c7-b161-3627acd47d03';
      const expectedResult: CommentWithDescendantsInterface[] = [mockComment];
      service.getCommentsList(articleId).subscribe((result) => {
        expect(result).toBe(expectedResult);
      });

      const req = httpController.expectOne(`${service.baseUrl}/${articleId}`);
      expect(req.request.method).toBe('GET');
      req.flush(expectedResult);
    });
  });

  describe('createComment', () => {
    it('should send request', () => {
      const mockData: CreateCommentDataInterface = {
        content: 'comment',
        articleId: '23a54326-57d8-41c7-b161-3627acd47d03',
        parentCommentId: null,
        level: 1,
      };
      const expectedResult: CommentInterface = newComment;
      service.createComment(mockData).subscribe((result) => {
        expect(result).toBe(expectedResult);
      });

      const req = httpController.expectOne(`${service.baseUrl}`);
      expect(req.request.method).toBe('POST');
      req.flush(expectedResult);
    });
  });

  describe('updateCommentLikesDislikes', () => {
    it('should send request', () => {
      const id = 'f81361ca-d151-4111-9233-49d8cd5d116c';
      const expectedResult: CommentInterface = newComment;
      service.updateCommentLikesDislikes(id, 1).subscribe((result) => {
        expect(result).toBe(expectedResult);
      });

      const req = httpController.expectOne(`${service.baseUrl}/likes`);
      expect(req.request.method).toBe('PUT');
      req.flush(expectedResult);
    });
  });

  describe('updateComment', () => {
    it('should send request', () => {
      const id = 'f81361ca-d151-4111-9233-49d8cd5d116c';
      const content = 'updated comment';
      const expectedResult: CommentInterface = newComment;
      service.updateComment(id, content).subscribe((result) => {
        expect(result).toBe(expectedResult);
      });

      const req = httpController.expectOne(`${service.baseUrl}/${id}`);
      expect(req.request.method).toBe('PUT');
      req.flush(expectedResult);
    });
  });

  describe('deleteComment', () => {
    it('should send request', () => {
      const id = 'f81361ca-d151-4111-9233-49d8cd5d116c';
      service.deleteComment(id).subscribe();

      const req = httpController.expectOne(`${service.baseUrl}/${id}`);
      expect(req.request.method).toBe('DELETE');
    });
  });
});
