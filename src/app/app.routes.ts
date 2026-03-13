import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'jokes',
    loadComponent: () => import('./pages/jokes/jokes'),
  },
  {
    path: 'favourites',
    loadComponent: () => import('./pages/favourites/favourites'),
  },
  {
    path: '',
    redirectTo: '/jokes',
    pathMatch: 'full',
  },
];
