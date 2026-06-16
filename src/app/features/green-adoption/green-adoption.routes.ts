import { Routes } from '@angular/router';

export const GREEN_ADOPTION_ROUTES: Routes = [
  {
    path: 'forest-sites',
    loadComponent: () => import('./pages/forest-sites-list/forest-sites-list.component').then(m => m.ForestSitesListComponent)
  },
  {
    path: 'proposals',
    loadComponent: () => import('./pages/proposals-list/proposals-list.component').then(m => m.ProposalsListComponent)
  },
  {
    path: 'agreements',
    loadComponent: () => import('./pages/agreements-list/agreements-list.component').then(m => m.AgreementsListComponent)
  }
];
