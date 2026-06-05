import { Component, inject, OnInit, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { HttpService } from '../../core/services/http.service';
import { Api } from '../../core/services/api';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CardModule, ButtonModule, CommonModule]
})
export class DashboardComponent implements OnInit {
  private httpService = inject(HttpService);
  private api = inject(Api);

  isLoading = signal(true);
  
  stats = [
    { title: 'Total Trees', value: '0', icon: 'pi pi-tree', color: '#10b981' },
    { title: 'Active Projects', value: '0', icon: 'pi pi-briefcase', color: '#3b82f6' },
    { title: 'Volunteers', value: '0', icon: 'pi pi-users', color: '#f59e0b' },
    { title: 'Survival Rate', value: '0%', icon: 'pi pi-chart-line', color: '#8b5cf6' }
  ];

  recentActivities: any[] = [];

  ngOnInit() {
    this.fetchDashboardData();
  }

  fetchDashboardData() {
    this.isLoading.set(true);
    
    // API CAll: Method Get /dashboard -> automatically authenticated via token interceptor
    this.httpService.get<any>(this.api.endpoints.dashboard).pipe(
      catchError(error => {
        console.error('Failed to fetch real dashboard data', error);
        this.isLoading.set(false);
        return of({ data: null });
      })
    ).subscribe((res) => {
      const data = res.data || res;
      if (!data) return;
      
      this.stats = [
        { title: 'Total Trees', value: data.totalTrees?.toLocaleString() || '0', icon: 'pi pi-tree', color: '#10b981' },
        { title: 'Active Projects', value: data.activeProjects?.toString() || '0', icon: 'pi pi-briefcase', color: '#3b82f6' },
        { title: 'Volunteers', value: data.volunteers?.toLocaleString() || '0', icon: 'pi pi-users', color: '#f59e0b' },
        { title: 'Survival Rate', value: `${data.survivalRate || 0}%`, icon: 'pi pi-chart-line', color: '#8b5cf6' }
      ];

      this.recentActivities = data.activities || [];
      this.isLoading.set(false);
    });
  }
}
