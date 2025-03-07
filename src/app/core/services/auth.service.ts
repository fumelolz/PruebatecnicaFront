import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../interfaces/ApiResponse.interface';
import { AuthLogin } from '../interfaces/AuthLogin.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  login(body: any): Observable<ApiResponse<AuthLogin>> {
    return this.http.post<ApiResponse<AuthLogin>>(
      environment.api.concat('auth/login'),
      body
    );
  }

  refreshToken(token: string): Observable<ApiResponse<AuthLogin>> {
    return this.http.post<ApiResponse<AuthLogin>>(
      environment.api.concat('auth/refreshtoken'),
      { token }
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('role');
    localStorage.removeItem('user_data');

    this.router.navigate(['auth', 'login']);
  }

  isLoggedIn() {
    return localStorage.getItem('access_token') !== null ? true : false;
  }

  setToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  get token(): string {
    return localStorage.getItem('access_token')!;
  }

  get role(): string {
    return localStorage.getItem('role')!;
  }

  get user(): any {
    return JSON.parse(localStorage.getItem('user_data')!);
  }
}
