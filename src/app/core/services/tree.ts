import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from './api';
import { HttpService } from './http.service';

export interface ITree {
  id?: string;
  _id?: string;
  plantTypeId: string;
  eventId?: string;
  location: string;
  latitude: number;
  longitude: number;
  status?: 'PLANTED' | 'GROWING' | 'HEALTHY' | 'WEAK' | 'DEAD';
  growthStage?: 'SEEDLING' | 'SAPLING' | 'YOUNG' | 'MATURE' | 'FLOWERING' | 'FRUITING';
  healthRemarks?: string;
  photos?: ITreePhoto[];
  plantedBy?: any; // User object
  plantedAt?: Date | string;
  plantType?: any; // Plant object when populated
}

export interface ITreePhoto {
  url: string;
  uploadedAt: Date | string;
  caption: string;
}

@Injectable({
  providedIn: 'root',
})
export class TreeService {
  private httpService = inject(HttpService);
  private api = inject(Api);

  getTrees(params?: any): Observable<any> {
    return this.httpService.get<any>(this.api.endpoints.trees, params);
  }

  createTree(data: ITree): Observable<any> {
    return this.httpService.post<any>(this.api.endpoints.trees, data);
  }

  updateTree(id: string, data: Partial<ITree>): Observable<any> {
    return this.httpService.patch<any>(`${this.api.endpoints.trees}/${id}`, data);
  }

  deleteTree(id: string): Observable<any> {
    return this.httpService.delete<any>(`${this.api.endpoints.trees}/${id}`);
  }

  updateTreeHealth(id: string, healthData: { status?: string; growthStage?: string; healthRemarks?: string }): Observable<any> {
    return this.httpService.patch<any>(`${this.api.endpoints.trees}/${id}/health`, healthData);
  }

  addTreePhoto(id: string, photoData: { url: string; caption: string }): Observable<any> {
    return this.httpService.post<any>(`${this.api.endpoints.trees}/${id}/photos`, photoData);
  }
}
