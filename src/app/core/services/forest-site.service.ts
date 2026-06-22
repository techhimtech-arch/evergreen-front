import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from './api';
import { HttpService } from './http.service';

export interface IForestSite {
  _id?: string;
  siteCode: string;
  siteName: string;
  circle?: string;
  division?: string;
  range?: string;
  block?: string;
  beat?: string;
  compartment?: string;
  district?: string;
  village?: string;
  areaHectare: number;
  latitude?: number;
  longitude?: number;
  description?: string;
  estimatedCost?: number;
  status: 'AVAILABLE' | 'UNDER_REVIEW' | 'ADOPTED' | 'ACTIVE' | 'COMPLETED' | 'SUSPENDED';
}

@Injectable({
  providedIn: 'root',
})
export class ForestSiteService {
  private httpService = inject(HttpService);
  private api = inject(Api);

  getSites(): Observable<any> {
    return this.httpService.get<any>(this.api.endpoints.forestSites);
  }

  getSite(id: string): Observable<any> {
    return this.httpService.get<any>(`${this.api.endpoints.forestSites}/${id}`);
  }

  createSite(data: Partial<IForestSite>): Observable<any> {
    return this.httpService.post<any>(this.api.endpoints.forestSites, data);
  }

  updateSite(id: string, data: Partial<IForestSite>): Observable<any> {
    return this.httpService.put<any>(`${this.api.endpoints.forestSites}/${id}`, data);
  }

  deleteSite(id: string): Observable<any> {
    return this.httpService.delete<any>(`${this.api.endpoints.forestSites}/${id}`);
  }
}
