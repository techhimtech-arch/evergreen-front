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
}

@Injectable({
  providedIn: 'root',
})
export class User {
  private httpService = inject(HttpService);
  private api = inject(Api);

  // 1. Fetch All Users
  getUsers(page: number = 1, limit: number = 10): Observable<any> {
    return this.httpService.get<any>(this.api.endpoints.users, { page, limit });
  }

  // 2. Create a New User
  createUser(userData: UserDetails): Observable<any> {
    return this.httpService.post<any>(this.api.endpoints.users, userData);
  }

  // 3. Get User Details
  getUserDetails(id: string): Observable<any> {
    return this.httpService.get<any>(`${this.api.endpoints.users}/${id}`);
  }

  // 4. Update User Details
  updateUser(id: string, updateData: Partial<UserDetails>): Observable<any> {
    return this.httpService.patch<any>(`${this.api.endpoints.users}/${id}`, updateData);
  }

  // 5. Delete User
  deleteUser(id: string): Observable<any> {
    return this.httpService.delete<any>(`${this.api.endpoints.users}/${id}`);
  }
}
