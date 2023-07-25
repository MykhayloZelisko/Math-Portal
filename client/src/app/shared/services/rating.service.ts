import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CurrentArticleStatusInterface } from '../models/interfaces/current-article-status.interface';
import { RatingType } from '../models/types/rating.type';
import { CurrentArticleRatingInterface } from '../models/interfaces/current-article-rating.interface';

@Injectable({
  providedIn: 'root',
})
export class RatingService {
  private baseUrl = `${environment.apiUrl}/rating`;

  public constructor(private httpClient: HttpClient) {}

  public getCurrentArticleStatus(
    articleId: number,
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
    articleId: number,
    rate: RatingType,
  ): Observable<CurrentArticleRatingInterface> {
    const body = { articleId, rate };
    return this.httpClient.post<CurrentArticleRatingInterface>(
      `${this.baseUrl}`,
      body,
    );
  }
}