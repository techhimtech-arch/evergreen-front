import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile').then(m => m.Profile)
  },
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
  },
  {
    path: 'roles',
    loadComponent: () => import('./pages/roles-management/roles-management').then(m => m.RolesManagement)
  },
  {
    path: 'assignments',
    loadComponent: () => import('./pages/target-assignments/target-assignments').then(m => m.TargetAssignments)
  },
  {
    path: 'events',
    loadComponent: () => import('./pages/event-management/event-management').then(m => m.EventManagement)
  }
];