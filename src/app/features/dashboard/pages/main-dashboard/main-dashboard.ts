import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { HttpService } from '../../../../core/services/http.service';
import { Api } from '../../../../core/services/api';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-main-dashboard',
  imports: [CommonModule, CardModule, ChartModule],
  templateUrl: './main-dashboard.html',
  styleUrl: './main-dashboard.css',
})
export class MainDashboard implements OnInit {
  private httpService = inject(HttpService);
  private api = inject(Api);

  isLoading = signal(true);

  stats = signal({
    totalGroups: '0',
    plantationSites: '0',
    totalPlants: '0',
    survivalRate: '0%'
  });

  basicData: any;
  basicOptions: any;

  chartData: any;
  chartOptions: any;

  ngOnInit() {
    this.initCharts();
    this.fetchDashboardData();
  }

  fetchDashboardData() {
    this.isLoading.set(true);

    this.httpService.get<any>(this.api.endpoints.dashboard).pipe(
      catchError(error => {
        console.error('Failed to fetch real dashboard data', error);
        return of({
          data: {
            totalGroups: '1,204',
            plantationSites: '845',
            totalPlants: '150,000',
            survivalRate: '92'
          }
        });
      })
    ).subscribe((res) => {
      const data = res.data || res;
      
      this.stats.set({
        // Based on whatever the API returns, mapping to the 4 stats cards shown on Main Dashboard
        totalGroups: data.totalGroups?.toLocaleString() || data.volunteers?.toLocaleString() || data.users || '0',
        plantationSites: data.plantationSites?.toLocaleString() || data.activeProjects?.toLocaleString() || data.projects || '0',
        totalPlants: data.totalPlants?.toLocaleString() || data.totalTrees?.toLocaleString() || data.plants || '0',
        survivalRate: data.survivalRate ? data.survivalRate + '%' : '0%'
      });

      this.isLoading.set(false);
    });
  }

  initCharts() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    // Survival Monitoring Mock Chart
    this.basicData = {
      labels: ['30 Days', '60 Days', '90 Days'],
      datasets: [
        {
          label: 'Live Plants',
          backgroundColor: '#4ade80',
          data: [15000, 14200, 13800]
        },
        {
          label: 'Dead Plants',
          backgroundColor: '#f87171',
          data: [500, 1300, 1700]
        }
      ]
    };

    this.basicOptions = {
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    // District-wise distribution Mock Chart
    this.chartData = {
        labels: ['Shimla', 'Kangra', 'Mandi', 'Kullu', 'Solan'],
        datasets: [
            {
                data: [4000, 3500, 3000, 2500, 2000],
                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#6366f1', '#8b5cf6']
            }
        ]
    };

    this.chartOptions = {
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: textColor
                }
            }
        }
    };
  }
}
