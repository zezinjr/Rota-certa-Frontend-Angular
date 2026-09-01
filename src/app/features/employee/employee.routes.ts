import { Routes } from '@angular/router';

export const EMPLOYEE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/employee-list/employee-list.component')
        .then(c => c.EmployeeListComponent)
  },
  {
    path: 'novo',
    loadComponent: () =>
      import('./components/employee-detail/employee-detail.component')
        .then(c => c.EmployeeDetailComponent)
  },
  {
    path: ':id/editar',
    loadComponent: () =>
      import('./components/employee-detail/employee-detail.component')
        .then(c => c.EmployeeDetailComponent)
  }
];
