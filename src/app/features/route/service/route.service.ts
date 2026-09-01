import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../../../core/services/base.service';
import { Route, RouteListResponse } from '../models/route';

@Injectable({
  providedIn: 'root'
})
export class RouteService extends BaseService<Route> {
  protected override readonly endpoint = 'routes';

  override getAll(params?: any): Observable<RouteListResponse | Route[]> {
    return super.getAll(params);
  }
}
