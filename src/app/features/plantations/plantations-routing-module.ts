import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { 
        path: 'list', 
        loadComponent: () => import('./pages/plantation-list/plantation-list.ts').then(c => c.PlantationList)
      },
      {
        path: 'new',
        loadComponent: () => import('./pages/plantation-form/plantation-form.ts').then(c => c.PlantationForm)
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('./pages/plantation-form/plantation-form.ts').then(c => c.PlantationForm)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlantationsRoutingModule { }
