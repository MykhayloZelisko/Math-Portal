import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CreateArticleInterface } from '../models/interfaces/create-article.interface';
import { Observable } from 'rxjs';
import { ArticleInterface } from '../models/interfaces/article.interface';
import { ArticlesListParamsInterface } from '../models/interfaces/articles-list-params.interface';

@Injectable({
  providedIn: 'root',
})
export class ArticlesService {
  private baseUrl = `${environment.apiUrl}/articles`;

  public constructor(private httpClient: HttpClient) {}

  public createArticle(
    article: CreateArticleInterface,
  ): Observable<ArticleInterface> {
    return this.httpClient.post<ArticleInterface>(`${this.baseUrl}`, article);
  }

  public getArticlesList(
    listParams: ArticlesListParamsInterface,
  ): Observable<ArticleInterface[]> {
    let params = new HttpParams();
    // params = params.append('page', listParams.page);
    // params = params.append('size', listParams.size);
    params = params.append('filter', listParams.filter);
    const tagsIds = listParams.tagsIds.join();
    params = params.append('tagsIds', tagsIds);
    return this.httpClient.get<ArticleInterface[]>(`${this.baseUrl}`, {
      params,
    });
  }

  public getArticle(id: number): Observable<ArticleInterface> {
    return this.httpClient.get<ArticleInterface>(`${this.baseUrl}/${id}`);
  }

  public deleteArticle(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`)
  }
}
