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
      refresh: `${this.URL}/auth/refresh-token`,
      logout: `${this.URL}/auth/logout`
    },
    dashboard: `${this.URL}/dashboard`,
    users: `${this.URL}/users`,
    roles: `${this.URL}/roles`,
    permissions: `${this.URL}/permissions`,
    groups: `${this.URL}/groups`,
    plants: `${this.URL}/plants`,
    trees: `${this.URL}/trees`,
    organizations: `${this.URL}/organizations`,
    assignments: `${this.URL}/assignments`,
    events: `${this.URL}/events`
  };
}
