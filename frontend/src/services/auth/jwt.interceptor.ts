import {
  HttpInterceptorFn,
  HttpErrorResponse,
  HttpHandlerFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, switchMap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

export const JwtInterceptor: HttpInterceptorFn = (
  req,
  next: HttpHandlerFn
): Observable<any> => {
  const authService = inject(AuthService);
  const token = localStorage.getItem('access_token');

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (
        error.status === 401 &&
        !req.url.includes('/auth/login') &&
        !req.url.includes('/auth/refresh')
      ) {
        return authService.refreshToken().pipe(
          switchMap(() => {
            const newToken = localStorage.getItem('access_token');
            if (newToken) {
              req = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`,
                },
              });
            }
            return next(req);
          }),
          catchError((refreshError) => {
            authService.logout();
            return throwError(refreshError);
          })
        );
      }
      return throwError(error);
    })
  );
};
