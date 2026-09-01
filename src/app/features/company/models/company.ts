export interface Company {
  id: number;
  name: string;
  email_domain?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CompanyListResponse {
  value?: Company[];
  results?: Company[];
  Count?: number;
  count?: number;
}
