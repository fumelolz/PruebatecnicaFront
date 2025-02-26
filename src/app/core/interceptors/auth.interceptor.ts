import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import {
  catchError,
  switchMap,
  finalize,
  filter,
  take,
  delay,
} from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoaderService } from '../services/loader.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> =
    new BehaviorSubject<string | null>(null);

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly _snackBar: MatSnackBar,
    private loaderService: LoaderService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const excludedRoutes = ['http://localhost:8000/auth/login'];

    if (excludedRoutes.includes(request.url)) {
      return next.handle(request);
    }

    this.loaderService.show();

    const accessToken = this.authService.token;
    if (accessToken) {
      request = this.addTokenToRequest(request, accessToken);
    }

    return next.handle(request).pipe(
      delay(environment.delay),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.handle401Error(request, next);
        }

        if (error.status === 500) {
          this._snackBar.open('Ocurrió un error en el servidor', '', {
            duration: 3000,
          });
          this.authService.logout();
        }
        return throwError(error);
      }),
      finalize(() => this.loaderService.hide())
    );
  }

  private handle401Error(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (this.isRefreshing) {
      return this.refreshTokenSubject.pipe(
        filter((token) => token !== null),
        take(1),
        switchMap((token) => {
          return next.handle(this.addTokenToRequest(request, token!));
        })
      );
    }

    this.isRefreshing = true;
    this.refreshTokenSubject.next(null);
    const refreshToken = localStorage.getItem('refresh_token')!;
    return this.authService.refreshToken(refreshToken).pipe(
      switchMap((response) => {
        const newAccessToken = response.data?.token;
        if (!newAccessToken) {
          throw new Error('No se pudo obtener un nuevo token');
        }
        this.authService.setToken(newAccessToken);
        this.refreshTokenSubject.next(newAccessToken);
        return next.handle(this.addTokenToRequest(request, newAccessToken));
      }),
      catchError((refreshError) => {
        this._snackBar.open('Sesión expirada. Inicia sesión nuevamente.', '', {
          duration: 3000,
        });
        this.authService.logout();
        return throwError(refreshError);
      }),
      finalize(() => {
        this.isRefreshing = false;
      })
    );
  }

  private addTokenToRequest(
    request: HttpRequest<unknown>,
    token: string
  ): HttpRequest<unknown> {
    return request.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }
}
