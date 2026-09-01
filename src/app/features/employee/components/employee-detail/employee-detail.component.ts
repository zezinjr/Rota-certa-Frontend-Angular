import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { EmployeeService } from '../../services/employee.service';
import { CompanyService } from '../../../company/service/company.service';
import { Company, CompanyListResponse } from '../../../company/models/company';
import { Person } from '../../models/person';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatAutocompleteModule
  ],
  templateUrl: './employee-detail.component.html',
  styleUrl: './employee-detail.component.scss'
})
export class EmployeeDetailComponent implements OnInit {
  private fb = inject(FormBuilder);
  private employeeService = inject(EmployeeService);
  private companyService = inject(CompanyService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form!: FormGroup;
  isEdit = false;
  employeeId: number | null = null;
  filteredCompanyOptions$!: Observable<string[]>;
  private companyOptions$ = new BehaviorSubject<string[]>([]);
  private companyNamesById = new Map<number, string>();
  private companyIdsByName = new Map<string, number>();

  ngOnInit(): void {
    this.initForm();
    this.initCompanyAutocomplete();
    this.loadCompanyOptions();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.employeeId = +id;
      this.loadEmployee(this.employeeId);
    }
  }

  initForm(): void {
    this.form = this.fb.group({
      company: ['', Validators.required],
      name: ['', Validators.required],
      phone: ['', Validators.required],
      type: ['EMPLOYEE', Validators.required],
      license_number: [null],
      employee_code: [null],
      is_active: [true]
    });

    this.form.get('type')?.valueChanges.subscribe(type => {
      this.updateValidators(type);
    });
  }

  private initCompanyAutocomplete(): void {
    const companyControl = this.form.get('company');
    if (!companyControl) return;

    this.filteredCompanyOptions$ = combineLatest([
      companyControl.valueChanges.pipe(startWith(companyControl.value ?? '')),
      this.companyOptions$
    ]).pipe(
      map(([value, companies]) => this.filterCompanies(String(value ?? ''), companies))
    );
  }

  private loadCompanyOptions(): void {
    this.companyService.getAll().subscribe({
      next: (response) => {
        const list = this.getCompaniesFromResponse(response) ?? [];

        // Mapa id -> nome
        this.companyNamesById = new Map(list.map(company => [company.id, company.name]));

        // Mapa nome(normalizado) -> id
        const nameToId = new Map<string, number>();
        for (const company of list) {
          const key = String(company.name ?? '').trim().toLowerCase();
          if (key && !nameToId.has(key)) {
            nameToId.set(key, company.id);
          }
        }
        this.companyIdsByName = nameToId;

        // Opções únicas e ordenadas para o autocomplete
        const companies = list
          .map(company => company.name)
          .filter(name => !!name?.trim());
        this.companyOptions$.next([...new Set(companies)].sort((a, b) => a.localeCompare(b)));
      },
      error: (err) => console.error('Erro ao carregar empresas:', err)
    });
  }

  private getCompaniesFromResponse(response: CompanyListResponse | Company[]): Company[] {
    if (Array.isArray(response)) return response;
    return response.value ?? response.results ?? [];
  }

  private filterCompanies(value: string, companies: string[]): string[] {
    const search = value.trim().toLowerCase();
    if (!search) return companies;

    return companies.filter(company => company.toLowerCase().includes(search));
  }

  updateValidators(type: string): void {
    const license = this.form.get('license_number');
    const code = this.form.get('employee_code');

    if (type === 'DRIVER') {
      license?.setValidators([Validators.required]);
      code?.clearValidators();
      code?.setValue(null);
    } else {
      code?.setValidators([Validators.required]);
      license?.clearValidators();
      license?.setValue(null);
    }
    license?.updateValueAndValidity();
    code?.updateValueAndValidity();
  }

  loadEmployee(id: number): void {
    this.employeeService.getById(id).subscribe({
      next: (employee) => {
        this.form.patchValue({
          ...employee,
          company: this.getCompanyFormValue(employee.company)
        });
        this.updateValidators(employee.type);
      },
      error: (err) => console.error('Erro ao carregar funcionário:', err)
    });
  }

  private getCompanyFormValue(company: Person['company']): string {
    return this.getCompanyName(company);
  }

  private getCompanyName(company: Person['company']): string {
    if (!company) return '';

    if (typeof company === 'object') {
      return company.name ?? company.company_name ?? '';
    }

    if (typeof company === 'number') {
      return this.companyNamesById.get(company) ?? '';
    }

    return String(company);
  }

  save(): void {
    if (this.form.invalid) return;

    const data = this.form.value;

    // Converter 'company' do formulário (nome/string) para ID esperado pelo backend
    let companyId: number | null = null;
    const rawCompany = data.company;

    if (typeof rawCompany === 'number') {
      companyId = rawCompany;
    } else if (rawCompany && typeof rawCompany === 'object' && 'id' in rawCompany) {
      companyId = Number((rawCompany as any).id);
    } else if (typeof rawCompany === 'string') {
      const key = rawCompany.trim().toLowerCase();
      companyId = this.companyIdsByName.get(key) ?? null;
    }

    if (companyId == null) {
      console.error('Empresa inválida ou não encontrada nas opções:', rawCompany);
      alert('Selecione uma empresa válida da lista.');
      return;
    }

    // Normalizar campos conforme o tipo
    const type = String(data.type ?? '').toUpperCase();
    const payload = {
      ...data,
      type,
      company: companyId,
    } as any;

    if (type === 'EMPLOYEE') {
      payload.license_number = null;
    } else if (type === 'DRIVER') {
      payload.employee_code = null;
    }

    if (this.isEdit && this.employeeId) {
      // Usando PATCH para atualização parcial
      this.employeeService.patch(this.employeeId, payload).subscribe({
        next: () => this.router.navigate(['/funcionarios']),
        error: (err) => console.error('Erro ao atualizar:', err?.error ?? err)
      });
    } else {
      this.employeeService.create(payload).subscribe({
        next: () => this.router.navigate(['/funcionarios']),
        error: (err) => console.error('Erro ao criar:', err?.error ?? err)
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/funcionarios']);
  }
}
