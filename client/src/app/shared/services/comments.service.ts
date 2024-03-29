import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommentWithDescendantsInterface } from '../models/interfaces/comment-with-descendants.interface';
import { CommentInterface } from '../models/interfaces/comment.interface';
import { CreateCommentDataInterface } from '../models/interfaces/create-comment-data.interface';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  public readonly baseUrl = `${environment.apiUrl}/comments`;

  private httpClient = inject(HttpClient);

  public getCommentsList(
    articleId: string,
  ): Observable<CommentWithDescendantsInterface[]> {
    return this.httpClient.get<CommentWithDescendantsInterface[]>(
      `${this.baseUrl}/${articleId}`,
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
