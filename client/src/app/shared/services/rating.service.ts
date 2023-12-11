import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CurrentArticleStatusInterface } from '../models/interfaces/current-article-status.interface';
import { CurrentArticleRatingInterface } from '../models/interfaces/current-article-rating.interface';
import { UpdateArticleRatingInterface } from '../models/interfaces/update-article-rating.interface';

@Injectable({
  providedIn: 'root',
})
export class RatingService {
  public readonly baseUrl = `${environment.apiUrl}/rating`;

  private httpClient = inject(HttpClient);

  public getCurrentArticleStatus(
    articleId: string,
  ): Observable<CurrentArticleStatusInterface> {
    let params = new HttpParams();
    params = params.append('articleId', articleId);
    return this.httpClient.get<CurrentArticleStatusInterface>(
      `${this.baseUrl}`,
      {
        params,
      },
    );
  }

  public updateArticleRating(
    body: UpdateArticleRatingInterface,
  ): Observable<CurrentArticleRatingInterface> {
    return this.httpClient.post<CurrentArticleRatingInterface>(
      `${this.baseUrl}`,
      body,
    );
  }
}
