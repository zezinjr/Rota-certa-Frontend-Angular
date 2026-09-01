export interface Route {
  id?: number;
  company: number;
  vehicle: number;
  name: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface RouteListResponse {
  value?: Route[];
  results?: Route[];
  Count?: number;
  count?: number;
}
