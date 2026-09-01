import { Routes } from '@angular/router';

export const COMPANY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/company-list/company-list.component')
        .then(c => c.CompanyListComponent)
  },
  {
    path: 'novo',
    loadComponent: () =>
      import('./components/company-detail/company-detail.component')
        .then(c => c.CompanyDetailComponent)
  },
  {
    path: ':id/editar',
    loadComponent: () =>
      import('./components/company-detail/company-detail.component')
        .then(c => c.CompanyDetailComponent)
  }
];
