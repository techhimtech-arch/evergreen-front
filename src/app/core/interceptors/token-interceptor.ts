import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';
import { catchError, switchMap, throwError } from 'rxjs';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Auth);
  const token = authService.getAccessToken();

  // Skip adding token to authentication endpoints
  if (req.url.includes('/auth/login') || req.url.includes('/auth/refresh-tokens')) {
    return next(req);
  }

  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 Unauthorized for expired tokens
      if (error.status === 401 && token) {
        // We could implement an automatic refresh token queue here.
        // For now, let's call the refresh token method and retry, or logout if it fails.
        return authService.refreshToken().pipe(
          switchMap((newToken) => {
            const retriedReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newToken.accessToken}` }
            });
            return next(retriedReq);
          }),
          catchError((refreshError) => {
            authService.logout();
            return throwError(() => refreshError);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
