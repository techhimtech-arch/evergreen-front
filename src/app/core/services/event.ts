import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from './api';
import { HttpService } from './http.service';

export interface IPlantationEvent {
  id?: string;
  _id?: string;
  eventName: string;
  description?: string;
  eventDate: string; // ISO date string
  location: string;
  organizerId: string;
  organizer?: any; // User object when populated
  targetPlants: number;
  actualPlants?: number;
  status: 'PLANNED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  photos?: string[];
  participants?: string[]; // Array of user IDs
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private httpService = inject(HttpService);
  private api = inject(Api);

  getEvents(params?: any): Observable<any> {
    return this.httpService.get<any>(this.api.endpoints.events, params);
  }

  createEvent(data: IPlantationEvent): Observable<any> {
    return this.httpService.post<any>(this.api.endpoints.events, data);
  }

  getEventById(id: string): Observable<any> {
    return this.httpService.get<any>(`${this.api.endpoints.events}/${id}`);
  }

  updateEvent(id: string, data: Partial<IPlantationEvent>): Observable<any> {
    return this.httpService.put<any>(`${this.api.endpoints.events}/${id}`, data);
  }

  deleteEvent(id: string): Observable<any> {
    return this.httpService.delete<any>(`${this.api.endpoints.events}/${id}`);
  }
}