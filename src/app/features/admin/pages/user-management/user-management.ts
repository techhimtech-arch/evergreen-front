import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { User, UserDetails } from '../../../../core/services/user';

@Component({
  selector: 'app-user-management',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TableModule, ButtonModule, DialogModule, InputTextModule, SelectModule, TooltipModule],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css',
})
export class UserManagement implements OnInit {
  private userService = inject(User);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  users = signal<any[]>([]);
  isLoading = signal(true);
  
  displayDialog = false;
  isEditing = false;
  editingId: string | null = null;
  
  searchQuery = '';
  selectedRole = '';
  selectedStatus = '';
  
  userForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: [''], // Required dynamic validation based on Creating vs Editing
    roleId: ['', Validators.required],
    isActive: [true]
  });

  // Mock roles until Phase 4 (Roles API) is integrated
  roleOptions = [
    { label: 'Super Admin', value: 'superadmin' },
    { label: 'Admin', value: 'admin' },
    { label: 'Coordinator', value: 'coordinator' },
    { label: 'Group Leader', value: 'group_leader' }
  ];

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers(page: number = 1, limit: number = 10) {
    this.isLoading.set(true);
    
    const params: any = { page, limit };
    if (this.searchQuery) params.search = this.searchQuery;
    if (this.selectedRole) params.role = this.selectedRole;
    if (this.selectedStatus) params.isActive = this.selectedStatus === 'active';
    
    this.userService.getUsers(params).subscribe({
      next: (res) => {
        // Handle varying backend response geometries gracefully
        const usersList = res.data || res.users || (Array.isArray(res) ? res : []);
        this.users.set(usersList);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('API Error, rendering fallback view', err);
        // Fallback UI to check design if backend is temporarily disconnected 
        this.users.set([
          { id: '1', firstName: 'John', lastName: 'Doe', email: 'john.doe@evergreen.com', role: { name: 'Super Admin' } },
          { id: '2', firstName: 'Pooja', lastName: 'Devi', email: 'pooja.group@evergreen.com', role: { name: 'Group Leader' } }
        ]);
        this.isLoading.set(false);
      }
    });
  }

  openNew() {
    this.isEditing = false;
    this.editingId = null;
    this.userForm.reset();
    
    // Password is required when creating a new user
    this.userForm.get('password')?.setValidators([Validators.required]);
    this.userForm.get('password')?.updateValueAndValidity();
    
    this.displayDialog = true;
  }

  editUser(user: any) {
    this.isEditing = true;
    this.editingId = user.id;
    
    // Password is optional during edit flow
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
    
    this.userForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      roleId: user.roleId || user.role?.id || this.roleOptions[1].value,
      isActive: user.isActive !== undefined ? user.isActive : true
    });
    
    this.displayDialog = true;
  }

  saveUser() {
    if (this.userForm.invalid) return;

    const payload: UserDetails = {
      firstName: this.userForm.value.firstName!,
      lastName: this.userForm.value.lastName!,
      email: this.userForm.value.email!,
      roleId: this.userForm.value.roleId!,
      isActive: this.userForm.value.isActive!
    };

    if (this.userForm.value.password) {
      payload.password = this.userForm.value.password;
    }

    if (this.isEditing && this.editingId) {
      this.userService.updateUser(this.editingId, payload).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User updated successfully' });
          this.displayDialog = false;
          this.loadUsers(); // Refresh Grid automatically!
        }
      });
    } else {
      this.userService.createUser(payload).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User created successfully' });
          this.displayDialog = false;
          this.loadUsers(); // Refresh Grid automatically!
        }
      });
    }
  }

  deleteUser(id: string) {
    if (confirm('Are you sure you want to permanently delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'User deleted successfully' });
          this.loadUsers(); // Refresh Grid automatically
        }
      });
    }
  }

  onSearch() {
    this.loadUsers();
  }

  onFilterChange() {
    this.loadUsers();
  }

  toggleUserStatus(user: any) {
    const newStatus = !user.isActive;
    this.userService.toggleUserStatus(user.id, newStatus).subscribe({
      next: () => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Status Updated', 
          detail: `User ${newStatus ? 'activated' : 'deactivated'} successfully` 
        });
        this.loadUsers(); // Refresh Grid automatically
      }
    });
  }
}
