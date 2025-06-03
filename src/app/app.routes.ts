import { Routes } from '@angular/router';

export const routes: Routes = [

  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./components/pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'menu', loadComponent: () => import('./components/pages/menu/menu.component').then(m => m.MenuComponent) },
  { path: 'create', loadComponent: () => import('./components/pages/create/create.component').then(m => m.CreateComponent) },
  { path: 'delete', loadComponent: () => import('./components/pages/delete/delete.component').then(m => m.DeleteComponent) },
  { path: 'update', loadComponent: () => import('./components/pages/update/update.component').then(m => m.UpdateComponent) },
  { path: 'view', loadComponent: () => import('./components/pages/view/view.component').then(m => m.ViewComponent) },
  { path: 'view-all', loadComponent: () => import('./components/pages/view-all/view-all.component').then(m => m.ViewAllComponent) },
];


// Está sendo usado o carregamento preguiçoso (lazy loading) para carregar o componente apenas quando necessário
