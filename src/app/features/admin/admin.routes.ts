import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'groups',
    loadComponent: () => import('./pages/group-management/group-management').then(m => m.GroupManagement)
  },
  {
    path: 'users',
    loadComponent: () => import('./pages/user-management/user-management').then(m => m.UserManagement)
  },
  {
    path: 'species',
    loadComponent: () => import('./pages/species-management/species-management').then(m => m.SpeciesManagement) // Agar exist kare to!
  },
  {
    path: 'organizations',
    loadComponent: () => import('./pages/organization-management/organization-management').then(m => m.OrganizationManagement)
  }
];