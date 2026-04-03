import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-main-dashboard',
  imports: [CommonModule, CardModule, ChartModule],
  templateUrl: './main-dashboard.html',
  styleUrl: './main-dashboard.css',
})
export class MainDashboard implements OnInit {
  basicData: any;
  basicOptions: any;

  chartData: any;
  chartOptions: any;

  ngOnInit() {
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
