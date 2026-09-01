import { Routes } from '@angular/router';

export const ROUTE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/route-list/route-list.component')
        .then(c => c.RouteListComponent)
  },
  {
    path: 'novo',
    loadComponent: () =>
      import('./components/route-detail/route-detail.component')
        .then(c => c.RouteDetailComponent)
  },
  {
    path: ':id/editar',
    loadComponent: () =>
      import('./components/route-detail/route-detail.component')
        .then(c => c.RouteDetailComponent)
  }
];
