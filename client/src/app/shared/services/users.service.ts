import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserInterface } from '../models/interfaces/user.interface';
import { UserWithTokenInterface } from '../models/interfaces/user-with-token.interface';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private baseUrl = `${environment.apiUrl}/users`;

  public user$: BehaviorSubject<UserInterface | null> =
    new BehaviorSubject<UserInterface | null>(null);

  public constructor(private httpClient: HttpClient) {}

  public getCurrentUser(): Observable<UserInterface> {
    return this.httpClient.get<UserInterface>(`${this.baseUrl}/current`);
  }

  public updateCurrentUser(
    data: UserInterface,
  ): Observable<UserWithTokenInterface> {
    return this.httpClient.put<UserWithTokenInterface>(
      `${this.baseUrl}/current`,
      data,
    );
  }

  public deleteCurrentUser(): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/current`);
  }

  public deleteCurrentUserPhoto(): Observable<UserWithTokenInterface> {
    return this.httpClient.delete<UserWithTokenInterface>(`${this.baseUrl}/current/photo`);
  }

  public updateCurrentUserPhoto(file: File): Observable<UserWithTokenInterface> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.httpClient.put<UserWithTokenInterface>(
      `${this.baseUrl}/current/photo`, formData
    );
  }

  public updateUserData(user: UserInterface | null): void {
    if (user) {
      this.user$.next({
        ...user,
        photo: user.photo ? `${environment.apiUrl}/${user.photo}`: null
      })
    } else {
      this.user$.next(null);
    }
  }
}
