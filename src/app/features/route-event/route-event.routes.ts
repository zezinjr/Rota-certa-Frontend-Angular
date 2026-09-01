import { Routes } from '@angular/router';

export const ROUTE_EVENT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/route-event-list/route-event-list.component')
        .then(c => c.RouteEventListComponent)
  },
  {
    path: 'novo',
    loadComponent: () =>
      import('./components/route-event-detail/route-event-detail.component')
        .then(c => c.RouteEventDetailComponent)
  },
  {
    path: ':id/editar',
    loadComponent: () =>
      import('./components/route-event-detail/route-event-detail.component')
        .then(c => c.RouteEventDetailComponent)
  }
];
