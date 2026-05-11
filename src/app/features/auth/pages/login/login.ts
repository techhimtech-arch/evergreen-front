import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { CommonModule } from '@angular/common';
import { MessageModule } from 'primeng/message';
import { Auth, User } from '../../../../core/services/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, CardModule, InputTextModule, ButtonModule, PasswordModule, MessageModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(Auth);
  private router = inject(Router);

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  isLoading = false;
  errorMessage = '';

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      const { username, password } = this.loginForm.value;

      this.authService.login(username!, password!).subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.success && res.user) {
            this.redirectByRole(res.user);
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err?.message || 'Login failed. Please check your credentials.';
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  private redirectByRole(user: User) {
    switch (user.role) {
      case 'SUPER_ADMIN':
      case 'ORG_ADMIN':
        this.router.navigate(['/admin/profile']);
        break;
      case 'VOLUNTEER':
        // Volunteers go to plantations to see their assignments
        this.router.navigate(['/plantations/list']);
        break;
      case 'CITIZEN':
        this.router.navigate(['/dashboard']);
        break;
      default:
        this.router.navigate(['/dashboard']);
    }
  }
}
