import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from './api';
import { HttpService } from './http.service';

export interface IInspection {
  id: string;
  treeId: string;
  inspectorId: string;
  scheduledDate: Date | string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'MISSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  treeStatus?: string;
  healthScore?: number;
  remarks?: string;
  photos?: IInspectionPhoto[];
  tree?: any; // Tree object when populated
  inspector?: any; // Inspector object when populated
}

export interface IInspectionPhoto {
  url: string;
  caption: string;
}

export interface IInspectionFindings {
  treeStatus: string;
  healthScore: number;
  remarks: string;
  photos?: IInspectionPhoto[];
}

@Injectable({
  providedIn: 'root',
})
export class InspectionService {
  private httpService = inject(HttpService);
  private api = inject(Api);

  getMyPendingInspections(params?: any): Observable<any> {
    return this.httpService.get<any>(this.api.endpoints.inspections.myPending, params);
  }

  completeInspection(inspectionId: string, findings: IInspectionFindings): Observable<any> {
    return this.httpService.patch<any>(this.api.endpoints.inspections.complete(inspectionId), findings);
  }

  getInspections(params?: any): Observable<any> {
    return this.httpService.get<any>(`${this.api.URL}/inspections`, params);
  }

  getInspection(id: string): Observable<any> {
    return this.httpService.get<any>(`${this.api.URL}/inspections/${id}`);
  }

  createInspection(data: Partial<IInspection>): Observable<any> {
    return this.httpService.post<any>(`${this.api.URL}/inspections`, data);
  }

  updateInspection(id: string, data: Partial<IInspection>): Observable<any> {
    return this.httpService.patch<any>(`${this.api.URL}/inspections/${id}`, data);
  }

  deleteInspection(id: string): Observable<any> {
    return this.httpService.delete<any>(`${this.api.URL}/inspections/${id}`);
  }
}
