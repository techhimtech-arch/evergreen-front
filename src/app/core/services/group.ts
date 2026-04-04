import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from './api';
import { HttpService } from './http.service';

export interface IGroup {
  id?: string;
  _id?: string;
  groupName: string;
  groupType: string;
  district: string;
  panchayat: string;
  village: string;
  leaderName: string;
  mobile: string;
  membersCount: number;
}

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private httpService = inject(HttpService);
  private api = inject(Api);

  getGroups(): Observable<any> {
    return this.httpService.get<any>(this.api.endpoints.groups);
  }

  createGroup(data: IGroup): Observable<any> {
    return this.httpService.post<any>(this.api.endpoints.groups, data);
  }

  updateGroup(id: string, data: Partial<IGroup>): Observable<any> {
    return this.httpService.patch<any>(`${this.api.endpoints.groups}/${id}`, data);
  }

  deleteGroup(id: string): Observable<any> {
    return this.httpService.delete<any>(`${this.api.endpoints.groups}/${id}`);
  }
}
