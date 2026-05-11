import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, CardModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  private fb = inject(FormBuilder);

  step = signal<'email' | 'otp' | 'reset' | 'done'>('email');
  isLoading = signal(false);
  errorMessage = signal('');

  emailForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  otpForm = this.fb.group({
    otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
  });

  resetForm = this.fb.group({
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required]
  });

  submitEmail() {
    if (this.emailForm.invalid) { this.emailForm.markAllAsTouched(); return; }
    this.isLoading.set(true);
    // Simulate API call
    setTimeout(() => {
      this.isLoading.set(false);
      this.step.set('otp');
    }, 1500);
  }

  submitOtp() {
    if (this.otpForm.invalid) { this.otpForm.markAllAsTouched(); return; }
    this.isLoading.set(true);
    setTimeout(() => {
      this.isLoading.set(false);
      this.step.set('reset');
    }, 1200);
  }

  submitReset() {
    if (this.resetForm.invalid) { this.resetForm.markAllAsTouched(); return; }
    const { newPassword, confirmPassword } = this.resetForm.value;
    if (newPassword !== confirmPassword) {
      this.errorMessage.set('Passwords do not match.');
      return;
    }
    this.errorMessage.set('');
    this.isLoading.set(true);
    setTimeout(() => {
      this.isLoading.set(false);
      this.step.set('done');
    }, 1500);
  }

  resendOtp() {
    this.isLoading.set(true);
    setTimeout(() => {
      this.isLoading.set(false);
    }, 1000);
  }
}
