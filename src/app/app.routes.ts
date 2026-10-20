import { Routes } from '@angular/router';
import {AppMenuComponent} from './layout/app-menu/app-menu.component';
import {authGuard, guestGuard, loggedInGuard} from './core/auth/auth.guards';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/login/login.component').then(c => c.LoginComponent),
  },
  {
    path: 'trocar-senha',
    canActivate: [loggedInGuard],
    loadComponent: () =>
      import('./features/auth/change-password/change-password.component').then(c => c.ChangePasswordComponent),
  },
  {
    path: '',
    component: AppMenuComponent,
    // Todo o painel exige gestor logado (o backend responde 401/403 sem token de gestor).
    canActivate: [authGuard],
    canActivateChild: [authGuard],
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
