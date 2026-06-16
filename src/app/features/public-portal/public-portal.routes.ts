import { Routes } from '@angular/router';

export const PUBLIC_PORTAL_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/public-dashboard/public-dashboard.component').then(m => m.PublicDashboardComponent)
  }
];
