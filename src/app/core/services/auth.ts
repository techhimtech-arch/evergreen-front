import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError, map } from 'rxjs';
import { Router } from '@angular/router';
import { Api } from './api';

export interface User {
  id: string;
  name: string;
  role: 'superadmin' | 'admin' | 'group_leader' | 'verifier';
  email?: string;
  district?: string;
  token?: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
  private api = inject(Api);
  private router = inject(Router);
  
  currentUser = signal<User | null>(null);

  login(email: string, password: string): Observable<{ success: boolean; user?: User }> {
    return this.http.post<any>(this.api.endpoints.auth.login, { email, password }).pipe(
      map(response => {
        // Adjust these mappings based on your actual backend response structure
        const authData = response.data || response;
        
        const user: User = {
          id: authData.user?.id || 'usr_fetched',
          name: authData.user?.firstName ? `${authData.user.firstName} ${authData.user.lastName || ''}` : email,
          role: authData.user?.role?.name || authData.user?.role || 'admin',
          district: authData.user?.district,
          email: email
        };

        this.currentUser.set(user);
        
        // Store tokens securely
        const accessToken = authData.accessToken || authData.token;
        const refreshToken = authData.refreshToken;
        
        if (accessToken) localStorage.setItem('accessToken', accessToken);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        return { success: true, user };
      }),
      catchError(error => {
        console.error('Login failed', error);
        return throwError(() => new Error('Login failed. Please check your credentials.'));
      })
    );
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  refreshToken(): Observable<{ accessToken: string }> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token available.'));
    }

    return this.http.post<any>(this.api.endpoints.auth.refresh, { refreshToken }).pipe(
      map(response => {
        const authData = response.data || response;
        const newAccessToken = authData.accessToken || authData.token;
        if (newAccessToken) localStorage.setItem('accessToken', newAccessToken);
        return { accessToken: newAccessToken };
      }),
      catchError((error) => {
        this.logout();
        return throwError(() => new Error('Session expired. Please log in again.'));
      })
    );
  }

  logout() {
    const refreshToken = this.getRefreshToken();
    
    // Call the logout API if we have a refresh token to invalidate
    if (refreshToken) {
      this.http.post(this.api.endpoints.auth.logout, { refreshToken })
        .pipe(catchError(() => throwError(() => null))) // Ignore backend failure cleanly
        .subscribe();
    }

    // Clear local states
    this.currentUser.set(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.router.navigate(['/login']);
  }

  checkAuth() {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      this.currentUser.set(JSON.parse(stored));
    }
  }
}
