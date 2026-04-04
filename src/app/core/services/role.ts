import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from './api';
import { HttpService } from './http.service';

export interface IRole {
  id?: string;
  name: string;
  description?: string;
  permissions: string[];
}

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private httpService = inject(HttpService);
  private api = inject(Api);

  getRoles(): Observable<any> {
    return this.httpService.get<any>(this.api.endpoints.roles);
  }

  createRole(data: IRole): Observable<any> {
    return this.httpService.post<any>(this.api.endpoints.roles, data);
  }

  updateRole(id: string, data: Partial<IRole>): Observable<any> {
    return this.httpService.patch<any>(`${this.api.endpoints.roles}/${id}`, data);
  }

  deleteRole(id: string): Observable<any> {
    return this.httpService.delete<any>(`${this.api.endpoints.roles}/${id}`);
  }

  getPermissions(): Observable<any> {
    return this.httpService.get<any>(this.api.endpoints.permissions);
  }
}
