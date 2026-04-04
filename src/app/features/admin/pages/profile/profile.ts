import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { User } from '../../../../core/services/user';
import { Auth } from '../../../../core/services/auth';

interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
  status: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  lastLoginAt?: string;
  uuid: string;
  preferences?: {
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    language: string;
    timezone: string;
  };
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    AvatarModule,
    BadgeModule,
    DividerModule,
    ProgressSpinnerModule,
    ToastModule,
    DialogModule,
    PasswordModule
  ],
  providers: [MessageService],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  private userService = inject(User);
  private messageService = inject(MessageService);
  private authService = inject(Auth);
  private fb = inject(FormBuilder);

  profile = signal<UserProfile | null>(null);
  loading = signal(true);
  
  displayChangePasswordDialog = false;
  changePasswordForm!: FormGroup;
  submittingPassword = false;

  ngOnInit() {
    this.loadProfile();
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  showChangePassword() {
    this.changePasswordForm.reset();
    this.displayChangePasswordDialog = true;
  }

  onChangePassword() {
    if (this.changePasswordForm.invalid) return;

    this.submittingPassword = true;
    const { currentPassword, newPassword } = this.changePasswordForm.value;
    
    this.authService.changePassword({ currentPassword, newPassword }).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Password changed successfully'
        });
        this.displayChangePasswordDialog = false;
        this.submittingPassword = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Failed to change password'
        });
        this.submittingPassword = false;
      }
    });
  }

  loadProfile() {
    this.loading.set(true);
    this.userService.getCurrentUserProfile().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.profile.set(response.data);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Failed to load profile', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load profile information'
        });
        this.loading.set(false);
      }
    });
  }

  getInitials(): string {
    const profile = this.profile();
    if (profile) {
      return `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase();
    }
    return 'U';
  }

  getStatusBadgeClass(): string {
    const profile = this.profile();
    if (profile?.status === 'ACTIVE' || profile?.isActive) {
      return 'p-badge-success';
    }
    return 'p-badge-danger';
  }

  getStatusText(): string {
    const profile = this.profile();
    return (profile?.status === 'ACTIVE' || profile?.isActive) ? 'Active' : 'Inactive';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}