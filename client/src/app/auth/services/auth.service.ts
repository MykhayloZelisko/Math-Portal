import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { RegistrationInterface } from '../../shared/models/interfaces/registration.interface';
import { Observable } from 'rxjs';
import { TokenInterface } from '../../shared/models/interfaces/token.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = `${environment.apiUrl}/auth`;
  constructor(private httpClient: HttpClient) {}

  public registration(data: RegistrationInterface): Observable<TokenInterface> {
    return this.httpClient.post<TokenInterface>(`${this.baseUrl}/registration`, data);
  }
}
