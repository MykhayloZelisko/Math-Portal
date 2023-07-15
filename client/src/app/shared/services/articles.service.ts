import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CreateArticleInterface } from '../models/interfaces/create-article.interface';
import { Observable } from 'rxjs';
import { ArticleInterface } from '../models/interfaces/article.interface';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {
  private baseUrl = `${environment.apiUrl}/articles`;
  public constructor(private httpClient: HttpClient) {}

  public createArticle(article: CreateArticleInterface): Observable<ArticleInterface> {
    return this.httpClient.post<ArticleInterface>(`${this.baseUrl}`, article);
  }
}
