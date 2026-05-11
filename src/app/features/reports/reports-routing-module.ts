import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', redirectTo: 'plantation', pathMatch: 'full' },
      {
        path: 'plantation',
        loadComponent: () => import('./pages/plantation-report/plantation-report').then(c => c.PlantationReport)
      },
      {
        path: 'survival',
        loadComponent: () => import('./pages/survival-report/survival-report').then(c => c.SurvivalReport)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
