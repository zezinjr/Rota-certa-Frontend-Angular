import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../../../core/services/base.service';
import { Vehicle, VehicleListResponse } from '../models/vehicle';

@Injectable({
  providedIn: 'root'
})
export class VehicleService extends BaseService<Vehicle> {
  protected override readonly endpoint = 'vehicles';

  override getAll(params?: any): Observable<VehicleListResponse | Vehicle[]> {
    return super.getAll(params);
  }
}
