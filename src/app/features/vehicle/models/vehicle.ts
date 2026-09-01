export interface VehicleDriverRef {
  id?: number;
  name?: string;
}

export interface Vehicle {
  id?: number;
  company: number;
  driver: number | VehicleDriverRef;
  plate_number: string;
  model: string;
  capacity: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface VehicleListResponse {
  value?: Vehicle[];
  results?: Vehicle[];
  Count?: number;
  count?: number;
}
