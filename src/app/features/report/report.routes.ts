import { Routes } from '@angular/router';

export const REPORT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/report-maintenance/report-maintenance.component')
        .then(c => c.ReportMaintenanceComponent),
    data: {
      title: 'Relatórios em manutenção',
      description: 'Esta funcionalidade ainda não está disponível.'
    }
  }
];
