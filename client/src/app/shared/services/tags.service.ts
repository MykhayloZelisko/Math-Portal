import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { TagInterface } from '../models/interfaces/tag.interface';

@Injectable({
  providedIn: 'root',
})
export class TagsService {
  public readonly baseUrl = `${environment.apiUrl}/tags`;

  public tag$: BehaviorSubject<TagInterface | null> =
    new BehaviorSubject<TagInterface | null>(null);

  private httpClient = inject(HttpClient);

  public getAllTags(): Observable<TagInterface[]> {
    return this.httpClient.get<TagInterface[]>(`${this.baseUrl}`);
  }

  public createTag(value: string): Observable<TagInterface> {
    const body = { value };
    return this.httpClient.post<TagInterface>(`${this.baseUrl}`, body);
  }

  public removeTag(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
  }

  public updateTag(id: string, value: string): Observable<TagInterface> {
    const body = { value };
    return this.httpClient.put<TagInterface>(`${this.baseUrl}/${id}`, body);
  }
}
