export type RouteEventType = 'departure' | 'stop' | 'delay' | 'arrival' | string;

export interface RouteEvent {
  id?: number;
  route: number;
  event_type: RouteEventType;
  description: string;
  latitude: string;
  longitude: string;
  timestamp?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface RouteEventListResponse {
  value?: RouteEvent[];
  results?: RouteEvent[];
  Count?: number;
  count?: number;
}
