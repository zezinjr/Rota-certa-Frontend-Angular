export interface Schedule {
  id?: number;
  company: number;
  weekdays: string[];
  time: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ScheduleListResponse {
  value?: Schedule[];
  results?: Schedule[];
  Count?: number;
  count?: number;
}
