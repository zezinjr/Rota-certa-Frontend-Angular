import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/auth/auth.service';
import { loginErrorMessage } from '../login/login.component';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './change-password.component.html',
  styleUrl: '../auth-page.scss',
})
export class ChangePasswordComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  /** No primeiro acesso a troca é obrigatória (sem "Voltar"). */
  readonly forced = computed(() => this.auth.mustChangePassword());
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = inject(FormBuilder).nonNullable.group({
    current: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirm: ['', Validators.required],
  });

  submit(): void {
    if (this.form.invalid || this.loading()) return;
    const { current, password, confirm } = this.form.getRawValue();
    if (password !== confirm) {
      this.error.set('As senhas não conferem.');
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    this.auth.changePassword(current, password).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/home']);
      },
      error: (err: unknown) => {
        this.loading.set(false);
        this.error.set(loginErrorMessage(err));
      },
    });
  }

  back(): void {
    this.router.navigate(['/home']);
  }

  logout(): void {
    this.auth.logout();
  }
}
