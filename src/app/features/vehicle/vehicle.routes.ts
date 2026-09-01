import { Routes } from '@angular/router';

export const VEHICLE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/vehicle-list/vehicle-list.component')
        .then(c => c.VehicleListComponent)
  },
  {
    path: 'novo',
    loadComponent: () =>
      import('./components/vehicle-detail/vehicle-detail.component')
        .then(c => c.VehicleDetailComponent)
  },
  {
    path: ':id/editar',
    loadComponent: () =>
      import('./components/vehicle-detail/vehicle-detail.component')
        .then(c => c.VehicleDetailComponent)
  }
];
