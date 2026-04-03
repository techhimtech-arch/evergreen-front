import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login/login').then(m => m.Login)
  },
  { 
    path: '',
    loadComponent: () => import('./shared/layout/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/pages/main-dashboard/main-dashboard').then(m => m.MainDashboard)
      },
      {
        path: 'admin',
        loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
      },
      {
        path: 'plantations/assign',
        loadComponent: () => import('./features/plantations/pages/plantation-assignment/plantation-assignment').then(m => m.PlantationAssignment)
      }
    ]
  }
];
