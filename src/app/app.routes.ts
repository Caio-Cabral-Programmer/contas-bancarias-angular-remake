import { Routes } from '@angular/router';

export const routes: Routes = [

  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./components/pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'menu', loadComponent: () => import('./components/pages/menu/menu.component').then(m => m.MenuComponent) },
  { path: 'create', loadComponent: () => import('./components/pages/create/create.component').then(m => m.CreateComponent) },
];


// Está sendo usado o carregamento preguiçoso (lazy loading) para carregar o componente apenas quando necessário
