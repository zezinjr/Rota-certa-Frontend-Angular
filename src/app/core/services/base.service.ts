import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export abstract class BaseService<T> {
  protected readonly http = inject(HttpClient);
  private readonly configService = inject(ConfigService);

  protected abstract readonly endpoint: string;

  protected get baseUrl(): string {
    return this.configService.getApiBaseUrl();
  }

  protected get fullUrl(): string {
    return `${this.baseUrl}/${this.endpoint}`;
  }

  private debugRequest(method: string, url: string, data?: any, params?: HttpParams): void {
    try {
      // Evita logar objetos gigantes/imutáveis
      const safeData = data !== undefined ? JSON.parse(JSON.stringify(data)) : undefined;
      console.debug(`[HTTP ${method}]`, {
        url,
        params: params?.toString?.(),
        body: safeData
      });
    } catch {
      console.debug(`[HTTP ${method}]`, { url, params: params?.toString?.() });
    }
  }

  private logAndRethrow(operation: string, url: string) {
    return (error: any) => {
      console.error(`[HTTP ${operation}] ERRO`, {
        url,
        status: error?.status,
        statusText: error?.statusText,
        message: error?.message,
        error: error?.error
      });
      return throwError(() => error);
    };
  }

  // ===================== GET =====================
  getAll(params?: any): Observable<any> {
    const url = `${this.fullUrl}/`;
    const httpParams = this.mapParams(params);
    this.debugRequest('GET', url, undefined, httpParams);
    return this.http.get<any>(url, { params: httpParams })
      .pipe(catchError(this.logAndRethrow('GET', url)));
  }

  getById(id: number | string): Observable<T> {
    const url = `${this.fullUrl}/${id}/`;
    this.debugRequest('GET', url);
    return this.http.get<T>(url)
      .pipe(catchError(this.logAndRethrow('GET', url)));
  }

  // ===================== CREATE =====================
  create(data: any): Observable<T> {
    const url = `${this.fullUrl}/`;
    this.debugRequest('POST', url, data);
    return this.http.post<T>(url, data)
      .pipe(catchError(this.logAndRethrow('POST', url)));
  }

  // ===================== UPDATE =====================
  update(id: number | string, data: any): Observable<T> {
    const url = `${this.fullUrl}/${id}/`;
    this.debugRequest('PUT', url, data);
    return this.http.put<T>(url, data)
      .pipe(catchError(this.logAndRethrow('PUT', url)));
  }

  // PATCH (recomendado para atualizações parciais)
  patch(id: number | string, data: any): Observable<T> {
    const url = `${this.fullUrl}/${id}/`;
    this.debugRequest('PATCH', url, data);
    return this.http.patch<T>(url, data)
      .pipe(catchError(this.logAndRethrow('PATCH', url)));
  }

  // ===================== DELETE =====================
  delete(id: number | string): Observable<void> {
    const url = `${this.fullUrl}/${id}/`;
    this.debugRequest('DELETE', url);
    return this.http.delete<void>(url)
      .pipe(catchError(this.logAndRethrow('DELETE', url)));
  }

  private mapParams(params: any): HttpParams {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          httpParams = httpParams.append(key, String(value));
        }
      });
    }
    return httpParams;
  }
}
