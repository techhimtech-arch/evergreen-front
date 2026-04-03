import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { Api } from './api';

export interface IOrganization {
  id?: string;
  _id?: string;
  name: string;
  slug: string;
  organizationType: 'GOVERNMENT' | 'NGO' | 'SCHOOL' | 'CSR';
  description?: string;
  contactEmail: string;
  contactPhone: string;
  address?: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  private http = inject(HttpService);
  private api = inject(Api);

  /**
   * 19. Fetch All Organizations
   */
  getOrganizations(params?: any): Observable<any> {
    return this.http.get<any>(this.api.endpoints.organizations, params);
  }

  /**
   * 20. Create a New Organization
   */
  createOrganization(payload: Partial<IOrganization>): Observable<any> {
    return this.http.post<any>(this.api.endpoints.organizations, payload);
  }

  /**
   * 21. Get Specific Organization Details
   */
  getOrganizationById(orgId: string): Observable<any> {
    return this.http.get<any>(`${this.api.endpoints.organizations}/${orgId}`);
  }

  /**
   * 22. Update Organization
   */
  updateOrganization(orgId: string, payload: Partial<IOrganization>): Observable<any> {
    return this.http.put<any>(`${this.api.endpoints.organizations}/${orgId}`, payload);
  }

  /**
   * 23. Toggle Organization Status
   */
  toggleOrganizationStatus(orgId: string, status: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE'): Observable<any> {
    return this.http.patch<any>(`${this.api.endpoints.organizations}/${orgId}/status`, { status });
  }
}
