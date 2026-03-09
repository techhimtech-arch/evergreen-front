import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CardModule, ButtonModule, CommonModule]
})
export class DashboardComponent {
  stats = [
    {
      title: 'Total Trees',
      value: '45,234',
      icon: 'pi pi-tree',
      color: '#10b981'
    },
    {
      title: 'Active Projects',
      value: '12',
      icon: 'pi pi-briefcase',
      color: '#3b82f6'
    },
    {
      title: 'Volunteers',
      value: '1,847',
      icon: 'pi pi-users',
      color: '#f59e0b'
    },
    {
      title: 'Survival Rate',
      value: '87.5%',
      icon: 'pi pi-chart-line',
      color: '#8b5cf6'
    }
  ];

  recentActivities = [
    { date: '2024-03-09', activity: 'New plantation project started in Village A', status: 'success' },
    { date: '2024-03-08', activity: 'Tree planting campaign completed', status: 'success' },
    { date: '2024-03-07', activity: 'Volunteer training session', status: 'info' },
    { date: '2024-03-06', activity: 'Monthly report generated', status: 'info' }
  ];
}
