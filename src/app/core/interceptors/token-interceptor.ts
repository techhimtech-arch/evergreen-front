import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';
import { catchError, switchMap, throwError, BehaviorSubject, filter, take } from 'rxjs';
import { MessageService } from 'primeng/api';

let isRefreshing = false;
let refreshTokenSubject = new BehaviorSubject<any>(null);

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Auth);
  const messageService = inject(MessageService);
  const token = authService.getAccessToken();

  let authReq = req;

  // We are now attaching the Access Token to ALL requests except /auth/login.
  // Because the backend requires the access token even on the /auth/refresh-tokens endpoint!
  if (token && !req.url.includes('/auth/login')) {
    authReq = req.clone({
      setHeaders: {
        Authorization: 'Bearer ' + token
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      const errorMsg = error.error?.message || error.error?.error || error.message || 'An unexpected error occurred';

      if (error.status !== 401 || !token) {
        messageService.add({
          severity: 'error',
          summary: 'Error ' + (error.status ? error.status : ''),
          detail: errorMsg,
          life: 5000 
        });
      }

      // Handle 401 token refresh queue logic (if a token exists and it's not the refresh endpoint itself failing)
      if (error.status === 401 && token && !req.url.includes('/auth/refresh-token')) {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(null);

          return authService.refreshToken().pipe(
            switchMap((newToken) => {
              isRefreshing = false;
              refreshTokenSubject.next(newToken.accessToken);
              const retriedReq = req.clone({
                setHeaders: { Authorization: 'Bearer ' + newToken.accessToken }
              });
              return next(retriedReq);
            }),
            catchError((refreshError) => {
              isRefreshing = false;
              authService.logout();
              messageService.add({ severity: 'error', summary: 'Session Expired', detail: 'Please log in again.' });
              return throwError(() => refreshError);
            })
          );
        } else {
          return refreshTokenSubject.pipe(
            filter(t => t != null),
            take(1),
            switchMap(jwt => {
              const retriedReq = req.clone({
                setHeaders: { Authorization: 'Bearer ' + jwt }
              });
              return next(retriedReq);
            })
          );
        }
      }
      return throwError(() => error);
    })
  );
};
