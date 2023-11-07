import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { RegistrationInterface } from '../../shared/models/interfaces/registration.interface';
import { Observable } from 'rxjs';
import { TokenInterface } from '../../shared/models/interfaces/token.interface';
import { LoginInterface } from '../../shared/models/interfaces/login.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public readonly baseUrl = `${environment.apiUrl}/auth`;

  public constructor(private httpClient: HttpClient) {}

  public registration(data: RegistrationInterface): Observable<void> {
    return this.httpClient.post<void>(`${this.baseUrl}/registration`, data);
  }

  public login(data: LoginInterface): Observable<TokenInterface> {
    return this.httpClient.post<TokenInterface>(`${this.baseUrl}/login`, data);
  }
}
