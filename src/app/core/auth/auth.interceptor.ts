import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, finalize, shareReplay, switchMap, throwError } from 'rxjs';
import { ConfigService } from '../services/config.service';
import { AuthService } from './auth.service';

/**
 * Envia o token do gestor em toda requisição à API e, em 401, renova o access
 * token uma vez com o refresh token. Se a renovação falhar, encerra a sessão.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly auth = inject(AuthService);
  private readonly config = inject(ConfigService);
  private refreshing$?: Observable<string>;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const apiBaseUrl = this.config.getApiBaseUrl();
    if (!apiBaseUrl || !req.url.startsWith(apiBaseUrl) || this.auth.isPublicAuthUrl(req.url)) {
      return next.handle(req);
    }

    return next.handle(this.withToken(req, this.auth.accessToken)).pipe(
      catchError(err => {
        if (!(err instanceof HttpErrorResponse) || err.status !== 401) {
          return throwError(() => err);
        }
        if (!this.auth.refreshToken) {
          this.auth.logout();
          return throwError(() => err);
        }
        return this.refresh().pipe(
          switchMap(token => next.handle(this.withToken(req, token))),
          catchError(refreshErr => {
            this.auth.logout();
            return throwError(() => refreshErr);
          })
        );
      })
    );
  }

  private withToken(req: HttpRequest<any>, token: string | null): HttpRequest<any> {
    return token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;
  }

  /** Compartilha uma única renovação entre requisições que receberam 401 ao mesmo tempo. */
  private refresh(): Observable<string> {
    if (!this.refreshing$) {
      this.refreshing$ = this.auth.refreshAccessToken().pipe(
        finalize(() => (this.refreshing$ = undefined)),
        shareReplay(1)
      );
    }
    return this.refreshing$;
  }
}
