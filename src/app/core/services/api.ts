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
      refresh: `${this.URL}/auth/refresh`,
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
    events: `${this.URL}/events`,
    inspections: {
      myPending: `${this.URL}/inspections/my-pending`,
      complete: (id: string) => `${this.URL}/inspections/${id}/complete`,
      history: (treeId: string) => `${this.URL}/inspections/tree/${treeId}/history`
    },
    plantationEvents: {
      list: `${this.URL}/plantation-events`,
      upcoming: `${this.URL}/plantation-events/upcoming`,
      join: (eventId: string) => `${this.URL}/plantation-events/${eventId}/join`
    },
    treeEndpoints: {
      statistics: `${this.URL}/trees/statistics`,
      mapData: `${this.URL}/trees/map-data`,
      timeline: (treeId: string) => `${this.URL}/trees/${treeId}/timeline`,
      photos: (treeId: string) => `${this.URL}/trees/${treeId}/photos`
    }
  };
}
