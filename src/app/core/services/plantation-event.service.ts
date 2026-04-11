import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from './api';
import { HttpService } from './http.service';

export interface IPlantationEvent {
  id: string;
  title: string;
  description: string;
  eventDate: Date | string;
  location: string;
  targetTrees: number;
  coordinatorId: string;
  participants: string[];
  plantTypes: string[];
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreatePlantationEvent {
  title: string;
  description: string;
  eventDate: Date | string;
  location: string;
  targetTrees: number;
  coordinatorId: string;
  participants?: string[];
  plantTypes?: string[];
  status?: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
}

@Injectable({
  providedIn: 'root',
})
export class PlantationEventService {
  private httpService = inject(HttpService);
  private api = inject(Api);

  getUpcomingEvents(params?: any): Observable<any> {
    return this.httpService.get<any>(this.api.endpoints.plantationEvents.upcoming, params);
  }

  getAllEvents(params?: any): Observable<any> {
    return this.httpService.get<any>(this.api.endpoints.plantationEvents.list, params);
  }

  createEvent(eventData: ICreatePlantationEvent): Observable<any> {
    return this.httpService.post<any>(this.api.endpoints.plantationEvents.list, eventData);
  }

  joinEvent(eventId: string): Observable<any> {
    return this.httpService.post<any>(this.api.endpoints.plantationEvents.join(eventId), {});
  }

  getEvent(eventId: string): Observable<any> {
    return this.httpService.get<any>(`${this.api.endpoints.plantationEvents.list}/${eventId}`);
  }

  updateEvent(eventId: string, data: Partial<IPlantationEvent>): Observable<any> {
    return this.httpService.patch<any>(`${this.api.endpoints.plantationEvents.list}/${eventId}`, data);
  }

  deleteEvent(eventId: string): Observable<any> {
    return this.httpService.delete<any>(`${this.api.endpoints.plantationEvents.list}/${eventId}`);
  }
}
