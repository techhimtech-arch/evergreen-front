import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from './api';
import { HttpService } from './http.service';

export interface IPlant {
  id?: string;
  _id?: string;
  name: string;
  scientificName: string;
  category: string; // 'FOREST' | 'FRUIT' | 'MEDICINAL' | 'ORNAMENTAL'
  description?: string;
  image?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PlantService {
  private httpService = inject(HttpService);
  private api = inject(Api);

  getPlants(): Observable<any> {
    return this.httpService.get<any>(this.api.endpoints.plants);
  }

  createPlant(data: IPlant): Observable<any> {
    return this.httpService.post<any>(this.api.endpoints.plants, data);
  }

  updatePlant(id: string, data: Partial<IPlant>): Observable<any> {
    return this.httpService.patch<any>(`${this.api.endpoints.plants}/${id}`, data);
  }

  deletePlant(id: string): Observable<any> {
    return this.httpService.delete<any>(`${this.api.endpoints.plants}/${id}`);
  }
}
