import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from './api';
import { HttpService } from './http.service';

export interface UserDetails {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  roleId: string;
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class User {
  private httpService = inject(HttpService);
  private api = inject(Api);

  // 5. Fetch All Users (with pagination and filters)
  getUsers(params?: { page?: number; limit?: number; role?: string; isActive?: boolean; search?: string }): Observable<any> {
    const queryParams = params ? Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined && value !== null)
    ) : {};
    return this.httpService.get<any>(this.api.endpoints.users, queryParams);
  }

  // 2. Create a New User
  createUser(userData: UserDetails): Observable<any> {
    return this.httpService.post<any>(this.api.endpoints.users, userData);
  }

  // 3. Get User Details
  getUserDetails(id: string): Observable<any> {
    return this.httpService.get<any>(`${this.api.endpoints.users}/${id}`);
  }

  // 8. Update User
  updateUser(id: string, updateData: Partial<UserDetails>): Observable<any> {
    return this.httpService.put<any>(`${this.api.endpoints.users}/${id}`, updateData);
  }

  // 9. Soft Delete User
  deleteUser(id: string): Observable<any> {
    return this.httpService.delete<any>(`${this.api.endpoints.users}/${id}`);
  }

  // 10. Toggle User Status (Active/Inactive)
  toggleUserStatus(id: string, isActive: boolean): Observable<any> {
    return this.httpService.patch<any>(`${this.api.endpoints.users}/${id}/status`, { isActive });
  }

  // 11. Search Users
  searchUsers(query: string, limit: number = 10): Observable<any> {
    return this.httpService.get<any>(`${this.api.endpoints.users}/search`, { q: query, limit });
  }

  // 12. User Statistics
  getUserStats(): Observable<any> {
    return this.httpService.get<any>(`${this.api.endpoints.users}/stats`);
  }
}
