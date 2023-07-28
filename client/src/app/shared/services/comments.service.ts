import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommentWithDescendantsInterface } from '../models/interfaces/comment-with-descendants.interface';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private baseUrl = `${environment.apiUrl}/comments`;

  public constructor(private httpClient: HttpClient) {}

  public getCommentsList(
    articleId: number,
  ): Observable<CommentWithDescendantsInterface[]> {
    return this.httpClient.get<CommentWithDescendantsInterface[]>(
      `${this.baseUrl}/${articleId}`,
    );
  }
}
