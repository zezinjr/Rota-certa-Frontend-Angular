import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { ConfigService } from '../services/config.service';

export interface AuthPerson {
  id: number;
  name: string;
  type: 'MANAGER' | 'EMPLOYEE' | 'DRIVER' | string;
  email?: string;
  company_id: number;
  company_name: string;
}

interface AuthResponse {
  access_token: string;
  refresh_token: string;
  must_change_password: boolean;
  person: AuthPerson;
}

interface Session {
  accessToken: string;
  refreshToken: string;
  mustChangePassword: boolean;
  person: AuthPerson;
}

const STORAGE_KEY = 'rotacerta.session';

/** Sessão do gestor no painel (JWT do backend Django em /api/auth/). */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(ConfigService);
  private readonly router = inject(Router);

  private readonly session = signal<Session | null>(this.restore());

  readonly person = computed(() => this.session()?.person ?? null);
  readonly isLoggedIn = computed(() => this.session() !== null);
  readonly mustChangePassword = computed(() => this.session()?.mustChangePassword ?? false);

  get accessToken(): string | null {
    return this.session()?.accessToken ?? null;
  }

  get refreshToken(): string | null {
    return this.session()?.refreshToken ?? null;
  }

  login(email: string, password: string): Observable<void> {
    return this.http
      .post<AuthResponse>(this.url('auth/login/'), { email: email.trim().toLowerCase(), password })
      .pipe(
        map(res => {
          if (res.person.type !== 'MANAGER') {
            throw new Error('O painel é exclusivo para gestores. Colaboradores e motoristas usam o app.');
          }
          this.save(res);
        })
      );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<void> {
    return this.http
      .post<AuthResponse>(this.url('auth/change-password/'), {
        current_password: currentPassword,
        new_password: newPassword,
      })
      .pipe(map(res => this.save(res)));
  }

  /** Renova o access token com o refresh token (usado pelo interceptor em respostas 401). */
  refreshAccessToken(): Observable<string> {
    return this.http
      .post<{ access_token: string }>(this.url('auth/refresh/'), { refresh: this.refreshToken })
      .pipe(
        map(res => {
          const current = this.session();
          if (current) this.persist({ ...current, accessToken: res.access_token });
          return res.access_token;
        })
      );
  }

  logout(): void {
    this.persist(null);
    this.router.navigate(['/login']);
  }

  /** Endpoints de /auth/ que não levam token (login, refresh, recuperação de senha). */
  isPublicAuthUrl(url: string): boolean {
    return url.includes('/auth/') && !url.endsWith('/auth/change-password/');
  }

  private url(path: string): string {
    return `${this.config.getApiBaseUrl()}/${path}`;
  }

  private save(res: AuthResponse): void {
    this.persist({
      accessToken: res.access_token,
      refreshToken: res.refresh_token,
      mustChangePassword: res.must_change_password,
      person: res.person,
    });
  }

  private persist(session: Session | null): void {
    this.session.set(session);
    try {
      if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Sem localStorage (modo privado): a sessão vale só enquanto a aba estiver aberta.
    }
  }

  private restore(): Session | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Session) : null;
    } catch {
      return null;
    }
  }
}
