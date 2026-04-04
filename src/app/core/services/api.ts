import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Api {
  public readonly URL = environment.apiUrl;

  public readonly endpoints = {
    auth: {
      login: `${this.URL}/auth/login`,
      refresh: `${this.URL}/auth/refresh-tokens`,
      logout: `${this.URL}/auth/logout`
    },
    dashboard: `${this.URL}/dashboard`,
    users: `${this.URL}/users`,
    roles: `${this.URL}/roles`,
    permissions: `${this.URL}/permissions`,
    groups: `${this.URL}/api/v1/groups`,
    plants: `${this.URL}/api/v1/plants`,
    trees: `${this.URL}/api/v1/trees`,
    organizations: `${this.URL}/organizations`
  };
}
