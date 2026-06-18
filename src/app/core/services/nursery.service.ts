import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from './api';
import { HttpService } from './http.service';

export interface INursery {
  _id?: string;
  name: string;
  organizationId: any;
  managerId: any;
  location: {
    address: string;
    district: string;
    latitude?: number;
    longitude?: number;
  };
  stock: Array<{
    plantTypeId: any;
    quantity: number;
  }>;
  isActive?: boolean;
}

export interface IPlantRequest {
  _id?: string;
  userId?: any;
  organizationId: any;
  groupId?: any;
  requestedSpecies: Array<{
    plantTypeId: any;
    quantity: number;
  }>;
  purpose?: string;
  location?: string;
  status?: string;
  remarks?: string;
}

export interface ISupplyDispatch {
  _id?: string;
  nurseryId: any;
  requestId?: any;
  receiverId: any;
  plants: Array<{
    plantTypeId: any;
    quantity: number;
  }>;
  dispatchDate?: string;
  status?: string;
  remarks?: string;
}

@Injectable({
  providedIn: 'root',
})
export class NurseryService {
  private httpService = inject(HttpService);
  private api = inject(Api);

  // Nursery Endpoints
  getNurseries(): Observable<any> {
    return this.httpService.get<any>(this.api.endpoints.nurseries);
  }

  createNursery(data: INursery): Observable<any> {
    return this.httpService.post<any>(this.api.endpoints.nurseries, data);
  }

  updateStock(id: string, plantTypeId: string, quantity: number): Observable<any> {
    return this.httpService.patch<any>(`${this.api.endpoints.nurseries}/${id}/stock`, { plantTypeId, quantity });
  }

  // Plant Request Endpoints
  getPlantRequests(): Observable<any> {
    return this.httpService.get<any>(this.api.endpoints.plantRequests);
  }

  createPlantRequest(data: IPlantRequest): Observable<any> {
    return this.httpService.post<any>(this.api.endpoints.plantRequests, data);
  }

  updateRequestStatus(id: string, status: string, remarks?: string): Observable<any> {
    return this.httpService.patch<any>(`${this.api.endpoints.plantRequests}/${id}/status`, { status, remarks });
  }

  // Supply Dispatch Endpoints
  getSupplyDispatches(): Observable<any> {
    return this.httpService.get<any>(this.api.endpoints.supplyDispatches);
  }

  createSupplyDispatch(data: ISupplyDispatch): Observable<any> {
    return this.httpService.post<any>(this.api.endpoints.supplyDispatches, data);
  }

  updateDispatchStatus(id: string, status: string, remarks?: string): Observable<any> {
    return this.httpService.patch<any>(`${this.api.endpoints.supplyDispatches}/${id}/status`, { status, remarks });
  }
}
