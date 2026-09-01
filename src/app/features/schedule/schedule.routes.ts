import { Routes } from '@angular/router';

export const SCHEDULE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/schedule-list/schedule-list.component')
        .then(c => c.ScheduleListComponent)
  },
  {
    path: 'novo',
    loadComponent: () =>
      import('./components/schedule-detail/schedule-detail.component')
        .then(c => c.ScheduleDetailComponent)
  },
  {
    path: ':id/editar',
    loadComponent: () =>
      import('./components/schedule-detail/schedule-detail.component')
        .then(c => c.ScheduleDetailComponent)
  }
];
