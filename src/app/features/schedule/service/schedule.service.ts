import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../../../core/services/base.service';
import { Schedule, ScheduleListResponse } from '../models/schedule';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService extends BaseService<Schedule> {
  protected override readonly endpoint = 'schedules';

  override getAll(params?: any): Observable<ScheduleListResponse | Schedule[]> {
    return super.getAll(params);
  }
}
