import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { EmployeeService } from '../../services/employee.service';
import { Company, CompanyListResponse } from '../../../company/models/company';
import { CompanyService } from '../../../company/service/company.service';
import { Person } from '../../models/person';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { extractPaginatedCount, extractPaginatedItems } from '../../../../shared/utils/paginated-response.util';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatPaginatorModule
  ],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss'
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  private employeeService = inject(EmployeeService);
  private companyService = inject(CompanyService);

  employees: Person[] = [];
  totalCount = 0;
  displayedColumns: string[] = ['name', 'company', 'phone', 'type', 'code', 'is_active', 'actions'];
  pageIndex = 0;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50];
  private companyNamesById = new Map<number, string>();

  private destroy$ = new Subject<void>();
  private pageChange$ = new Subject<PageEvent>();

  ngOnInit(): void {
    this.loadCompanies();
    this.loadEmployees();

    this.pageChange$
      .pipe(debounceTime(250), takeUntil(this.destroy$))
      .subscribe(event => {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.loadEmployees(this.pageIndex, this.pageSize);
      });
  }

  loadCompanies(): void {
    this.companyService.getAll().subscribe({
      next: (response) => {
        this.companyNamesById = new Map(
          this.getCompaniesFromResponse(response).map(company => [company.id, company.name])
        );
      },
      error: (err) => console.error('Erro ao carregar empresas:', err)
    });
  }

  loadEmployees(pageIndex: number = this.pageIndex, pageSize: number = this.pageSize): void {
    this.employeeService.getAll({ page: pageIndex + 1, page_size: pageSize }).subscribe({
      next: (response) => {
        console.log('Resposta da API:', response); // ← útil para debug
        const items = this.getEmployeesFromResponse(response);
        this.employees = items;
        this.totalCount = this.getTotalCountFromResponse(response, items.length);
      },
      error: (err) => {
        console.error('Erro ao carregar funcionários:', err);
        this.totalCount = 0;
        this.employees = [];
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageChange$.next(event);
  }



  deleteEmployee(id: number): void {
    if (confirm('Tem certeza que deseja excluir este funcionário?')) {
      this.employeeService.delete(id).subscribe({
        next: () => this.loadEmployees(),
        error: (err) => console.error('Erro ao excluir:', err)
      });
    }
  }

  getTypeLabel(type: Person['type'] | string | null | undefined): string {
    const normalizedType = String(type ?? '').trim().toUpperCase();
    const labels: Record<string, string> = {
      EMPLOYEE: 'Funcionário',
      DRIVER: 'Motorista'
    };

    return labels[normalizedType] ?? '-';
  }

  isEmployeeType(type: Person['type'] | string | null | undefined): boolean {
    return String(type ?? '').trim().toUpperCase() === 'EMPLOYEE';
  }

  getCompanyLabel(company: Person['company']): string {
    if (!company) return '-';

    if (typeof company === 'object') {
      return company.name || company.company_name || '-';
    }

    if (typeof company === 'number') {
      return this.companyNamesById.get(company) ?? '-';
    }

    return String(company);
  }

  private getCompaniesFromResponse(response: CompanyListResponse | Company[]): Company[] {
    if (Array.isArray(response)) return response;
    return response.value ?? response.results ?? [];
  }

  private getEmployeesFromResponse(response: any): Person[] {
    return extractPaginatedItems<Person>(response);
  }

  private getTotalCountFromResponse(response: any, fallbackLength: number): number {
    return extractPaginatedCount(response, fallbackLength);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
