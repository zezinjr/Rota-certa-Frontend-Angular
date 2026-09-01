import { Routes } from '@angular/router';
import {AppMenuComponent} from './layout/app-menu/app-menu.component';

export const routes: Routes = [
  {
    path: '',
    component: AppMenuComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/report/components/report-maintenance/report-maintenance.component')
            .then(c => c.ReportMaintenanceComponent),
        data: {
          title: 'Dashboard em manutenção',
          description: 'O painel ainda não está disponível.'
        }
      },
      {
        path: 'funcionarios',
        loadChildren: () =>
          import('./features/employee/employee.routes')
            .then(r => r.EMPLOYEE_ROUTES)
      },
      {
        path: 'veiculos',
        loadChildren: () =>
          import('./features/vehicle/vehicle.routes')
            .then(r => r.VEHICLE_ROUTES)
      },
      {
        path: 'rotas',
        loadChildren: () =>
          import('./features/route/route.routes')
            .then(r => r.ROUTE_ROUTES)
      },
      {
        path: 'horarios',
        loadChildren: () =>
          import('./features/schedule/schedule.routes')
            .then(r => r.SCHEDULE_ROUTES)
      },
      {
        path: 'eventos-rota',
        loadChildren: () =>
          import('./features/route-event/route-event.routes')
            .then(r => r.ROUTE_EVENT_ROUTES)
      },
      {
        path: 'relatorios',
        loadChildren: () =>
          import('./features/report/report.routes')
            .then(r => r.REPORT_ROUTES)
      },
      {
        path: 'mapa',
        loadComponent: () =>
          import('./features/report/components/report-maintenance/report-maintenance.component')
            .then(c => c.ReportMaintenanceComponent),
        data: {
          title: 'Mapa ao vivo em manutenção',
          description: 'O mapa ao vivo ainda não está disponível.'
        }
      },
      {
        path: 'configuracoes',
        loadComponent: () =>
          import('./features/report/components/report-maintenance/report-maintenance.component')
            .then(c => c.ReportMaintenanceComponent),
        data: {
          title: 'Configurações em manutenção',
          description: 'A área de configurações ainda não está disponível.'
        }
      },
      {
        path: "home",
        loadComponent: () => import("./layout/home/home.component").then(c => c.HomeComponent),
      },

      {
        path: 'company',
        loadChildren: () =>
          import('./features/company/company.routes')
            .then(r => r.COMPANY_ROUTES)
      },
      {
        path: 'empresas',
        redirectTo: 'company',
        pathMatch: 'full'
      },

      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
];
