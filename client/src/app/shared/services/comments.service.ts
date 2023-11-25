import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommentInterface } from '../models/interfaces/comment.interface';
import { CreateCommentDataInterface } from '../models/interfaces/create-comment-data.interface';
import { CommentsListInterface } from '../models/interfaces/comments-list.interface';
import { CommentsListParamsInterface } from '../models/interfaces/comments-list-params.interface';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  public readonly baseUrl = `${environment.apiUrl}/comments`;

  public constructor(private httpClient: HttpClient) {}

  public getCommentsListByArticleId(
    articleId: string,
    listParams: CommentsListParamsInterface,
  ): Observable<CommentsListInterface> {
    let params = new HttpParams();
    params = params.append('page', listParams.page);
    params = params.append('size', listParams.size);
    return this.httpClient.get<CommentsListInterface>(
      `${this.baseUrl}/${articleId}`,
      { params },
    );
  }

  public getCommentsListByCommentId(
    commentId: string,
    listParams: CommentsListParamsInterface,
  ): Observable<CommentsListInterface> {
    let params = new HttpParams();
    params = params.append('page', listParams.page);
    params = params.append('size', listParams.size);
    return this.httpClient.get<CommentsListInterface>(
      `${this.baseUrl}/children/${commentId}`,
      { params },
    );
  }

  public createComment(
    content: CreateCommentDataInterface,
  ): Observable<CommentInterface> {
    return this.httpClient.post<CommentInterface>(`${this.baseUrl}`, content);
  }

  public updateCommentLikesDislikes(
    commentId: string,
    status: -1 | 1,
  ): Observable<CommentInterface> {
    const body = { commentId, status };
    return this.httpClient.put<CommentInterface>(`${this.baseUrl}/likes`, body);
  }

  public updateComment(
    id: string,
    content: string,
  ): Observable<CommentInterface> {
    return this.httpClient.put<CommentInterface>(`${this.baseUrl}/${id}`, {
      content,
    });
  }

  public deleteComment(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
  }
}
