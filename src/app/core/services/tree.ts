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
  photo?: string;
  status?: 'PLANTED' | 'GROWING' | 'DEAD';
  plantedBy?: any; // User object
  plantedAt?: Date;
  plantType?: any; // Plant object when populated
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
}
