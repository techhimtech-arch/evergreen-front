import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login/login').then(m => m.Login)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./features/auth/pages/forgot-password/forgot-password').then(m => m.ForgotPassword)
  },
  {
    path: 'green-adoption',
    loadChildren: () => import('./features/public-portal/public-portal.routes').then(m => m.PUBLIC_PORTAL_ROUTES)
  },
  {
    path: '',
    loadComponent: () => import('./shared/layout/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [authGuard],
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
        path: 'green-adoption-admin',
        loadChildren: () => import('./features/green-adoption/green-adoption.routes').then(m => m.GREEN_ADOPTION_ROUTES)
      },
      {
        path: 'plantations/assign',
        loadComponent: () => import('./features/plantations/pages/plantation-assignment/plantation-assignment').then(m => m.PlantationAssignment)
      },
      {
        path: 'plantations',
        loadChildren: () => import('./features/plantations/plantations-routing-module').then(m => m.PlantationsRoutingModule)
      },
      {
        path: 'inspections',
        loadComponent: () => import('./features/inspections/pages/pending-inspections/pending-inspections.component').then(m => m.PendingInspectionsComponent)
      },
      {
        path: 'reports',
        loadChildren: () => import('./features/reports/reports-routing-module').then(m => m.ReportsRoutingModule)
      },
      {
        path: 'map',
        loadComponent: () => import('./features/map/pages/map-view/map-view').then(m => m.MapView)
      },
      {
        path: 'csr',
        loadComponent: () => import('./features/csr/pages/csr-dashboard/csr-dashboard').then(m => m.CsrDashboard)
      }
    ]
  }
];
