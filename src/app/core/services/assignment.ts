import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Api } from './api';

export interface IAssignment {
  _id?: string;
  groupId: any;
  assignedOfficer?: any;
  landArea: number;
  targetPlants: number;
  species: string[];
  assignedDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IAssignmentResponse {
  success: boolean;
  count?: number;
  data: IAssignment | IAssignment[];
}

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {
  private http = inject(HttpClient);
  private api = inject(Api);

  getAssignments(params?: any): Observable<IAssignmentResponse> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get<IAssignmentResponse>(this.api.endpoints.assignments, { params: httpParams });
  }

  getAssignment(id: string): Observable<IAssignmentResponse> {
    return this.http.get<IAssignmentResponse>(`${this.api.endpoints.assignments}/${id}`);
  }

  createAssignment(data: Partial<IAssignment>): Observable<IAssignmentResponse> {
    return this.http.post<IAssignmentResponse>(this.api.endpoints.assignments, data);
  }

  updateAssignment(id: string, data: Partial<IAssignment>): Observable<IAssignmentResponse> {
    return this.http.put<IAssignmentResponse>(`${this.api.endpoints.assignments}/${id}`, data);
  }

  deleteAssignment(id: string): Observable<any> {
    return this.http.delete<any>(`${this.api.endpoints.assignments}/${id}`);
  }
}
