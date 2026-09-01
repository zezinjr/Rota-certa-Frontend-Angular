export type PersonType = 'DRIVER' | 'EMPLOYEE';

export interface CompanyRef {
  id?: number;
  name?: string;
  company_name?: string;
  url?: string;
}

export interface Person {
  id?: number;
  company: number | string | CompanyRef;
  name: string;
  phone: string;
  type: PersonType;
  license_number: string | null;
  employee_code: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  auto_email?: string | null;
}

export interface PaginatedPeople {
  count: number;
  next: string | null;
  previous: string | null;
  results: Person[];
}
