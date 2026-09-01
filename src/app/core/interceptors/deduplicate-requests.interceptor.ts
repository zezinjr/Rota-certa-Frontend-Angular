import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';

@Injectable()
export class DeduplicateRequestsInterceptor implements HttpInterceptor {
  private inFlightRequests = new Map<string, Observable<HttpEvent<any>>>();

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const key = this.buildKey(req);

    const existing = this.inFlightRequests.get(key);
    if (existing) {
      return existing;
    }

    const request$ = next.handle(req).pipe(shareReplay(1));
    this.inFlightRequests.set(key, request$);

    // Limpa o mapa ao finalizar (sucesso, erro ou complete)
    request$.subscribe({
      next: () => this.inFlightRequests.delete(key),
      error: () => this.inFlightRequests.delete(key),
      complete: () => this.inFlightRequests.delete(key)
    });

    return request$;
  }

  private buildKey(req: HttpRequest<any>): string {
    const { method, urlWithParams, body } = req;
    let bodyString = '';
    try {
      bodyString = body ? JSON.stringify(body) : '';
    } catch {
      bodyString = '';
    }
    return `${method}::${urlWithParams}::${bodyString}`;
  }
}
