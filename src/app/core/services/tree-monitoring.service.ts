import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from './api';
import { HttpService } from './http.service';

export interface ITreeStatistics {
  totalTrees: number;
  healthyTrees: number;
  weakTrees: number;
  deadTrees: number;
  survivalRate: number;
  growthDistribution: {
    SEEDLING: number;
    SAPLING: number;
    YOUNG: number;
    MATURE: number;
  };
  monthlyPlantation: Array<{
    month: string;
    count: number;
  }>;
}

export interface ITreeMapData {
  id: string;
  latitude: number;
  longitude: number;
  status: string;
  growthStage: string;
  healthScore?: number;
  species?: string;
  plantedDate?: string;
}

export interface IMapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface ITreePhoto {
  id: string;
  url: string;
  caption: string;
  takenAt: Date | string;
  latitude?: number;
  longitude?: number;
}

export interface ITimelineItem {
  id: string;
  date: Date | string;
  type: 'photo' | 'event' | 'inspection';
  title?: string;
  description?: string;
  url?: string;
  caption?: string;
}

@Injectable({
  providedIn: 'root',
})
export class TreeMonitoringService {
  private httpService = inject(HttpService);
  private api = inject(Api);

  getTreeStatistics(filters?: any): Observable<any> {
    return this.httpService.get<any>(this.api.endpoints.treeEndpoints.statistics, filters);
  }

  getTreeMapData(bounds?: IMapBounds): Observable<any> {
    if (bounds) {
      const params: { [key: string]: number } = {
        north: bounds.north,
        south: bounds.south,
        east: bounds.east,
        west: bounds.west
      };
      return this.httpService.get<any>(this.api.endpoints.treeEndpoints.mapData, params);
    }
    return this.httpService.get<any>(this.api.endpoints.treeEndpoints.mapData);
  }

  getTreeTimeline(treeId: string): Observable<any> {
    return this.httpService.get<any>(this.api.endpoints.treeEndpoints.timeline(treeId));
  }

  uploadTreePhoto(treeId: string, photoData: Partial<ITreePhoto>): Observable<any> {
    return this.httpService.post<any>(this.api.endpoints.treeEndpoints.photos(treeId), photoData);
  }

  getTreePhotos(treeId: string): Observable<any> {
    return this.httpService.get<any>(this.api.endpoints.treeEndpoints.photos(treeId));
  }

  deleteTreePhoto(treeId: string, photoId: string): Observable<any> {
    return this.httpService.delete<any>(`${this.api.endpoints.treeEndpoints.photos(treeId)}/${photoId}`);
  }
}
