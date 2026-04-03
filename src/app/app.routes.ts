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
        path: 'groups',
        loadComponent: () => import('./features/admin/pages/group-management/group-management').then(m => m.GroupManagement)
      },
      {
        path: 'plantations/assign',
        loadComponent: () => import('./features/plantations/pages/plantation-assignment/plantation-assignment').then(m => m.PlantationAssignment)
      }
    ]
  }
];
