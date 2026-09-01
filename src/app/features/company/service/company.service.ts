import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../../../core/services/base.service';
import { Company, CompanyListResponse } from '../models/company';

@Injectable({
  providedIn: 'root'
})
export class CompanyService extends BaseService<Company> {
  protected override readonly endpoint = 'companies';

  override getAll(params?: any): Observable<CompanyListResponse | Company[]> {
    return super.getAll(params);
  }
}
