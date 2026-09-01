import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../../../core/services/base.service';
import { RouteEvent, RouteEventListResponse } from '../models/route-event';

@Injectable({
  providedIn: 'root'
})
export class RouteEventService extends BaseService<RouteEvent> {
  protected override readonly endpoint = 'route-events';

  override getAll(params?: any): Observable<RouteEventListResponse | RouteEvent[]> {
    return super.getAll(params);
  }
}
