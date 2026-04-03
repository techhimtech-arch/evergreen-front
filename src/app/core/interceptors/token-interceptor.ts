import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';
import { catchError, switchMap, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Auth);
  const messageService = inject(MessageService);
  const token = authService.getAccessToken();

  let authReq = req;
  
  if (token && !req.url.includes('/auth/login') && !req.url.includes('/auth/refresh-tokens')) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Find the specific error string
      const errorMsg = error.error?.message || error.error?.error || error.message || 'An unexpected error occurred';
      
      // If it's a backend 500 error or similar, pop up the Toast!
      if (error.status !== 401 || !token) {
        messageService.add({
          severity: 'error',
          summary: `Error ${error.status ? error.status : ''}`,
          detail: errorMsg,
          life: 5000 // Display for 5 seconds
        });
      }

      // Handle 401 token refresh queue logic (if a token exists)
      if (error.status === 401 && token) {
        return authService.refreshToken().pipe(
          switchMap((newToken) => {
            const retriedReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newToken.accessToken}` }
            });
            return next(retriedReq);
          }),
          catchError((refreshError) => {
            messageService.add({ severity: 'error', summary: 'Session Expired', detail: 'Please log in again.' });
            authService.logout();
            return throwError(() => refreshError);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
