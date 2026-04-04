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
import { OrganizationService, IOrganization } from '../../../../core/services/organization';

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
  private orgService = inject(OrganizationService);

  users = signal<any[]>([]);
  isLoading = signal(true);
  organizations = signal<IOrganization[]>([]);

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
    userType: ['', Validators.required], // Changed from roleId
    organizationId: [''],
    status: ['ACTIVE'] // Changed from isActive
  });

  // Mock roles until Phase 4 (Roles API) is integrated
  roleOptions = [
    { label: 'Super Admin', value: 'SUPER_ADMIN' },
    { label: 'Org Admin', value: 'ORG_ADMIN' },
    { label: 'Volunteer', value: 'VOLUNTEER' },
    { label: 'Citizen', value: 'CITIZEN' }
  ];

  ngOnInit() {
    this.loadUsers();
    this.loadOrganizations();
  }

  loadOrganizations() {
    this.orgService.getOrganizations({ limit: 100 }).subscribe({
      next: (res) => {
        const orgs = res.data || res || [];
        this.organizations.set(orgs);
      },
      error: (err) => console.error('Failed to load organizations', err)
    });
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
        // Map users to ensure isActive is derived from status for the UI
        const mappedUsers = usersList.map((u: any) => ({
          ...u,
          isActive: u.status === 'ACTIVE' || u.isActive === true || u.status === undefined
        }));
        this.users.set(mappedUsers);
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
      userType: user.userType || user.roleId || user.role?.id || this.roleOptions[1].value, // Changed from roleId
      organizationId: user.organizationId || null,
      status: user.status || (user.isActive === true ? 'ACTIVE' : 'INACTIVE') // Changed from isActive
    });

    this.displayDialog = true;
  }

  saveUser() {
    if (this.userForm.invalid) return;

    const payload: any = {
      firstName: this.userForm.value.firstName!,
      lastName: this.userForm.value.lastName!,
      email: this.userForm.value.email!,
      userType: this.userForm.value.userType!, // Already correct
      status: this.userForm.value.status!, // Changed from isActive mapping
      password: this.userForm.value.password, // Directly assigning password    
      organizationId: this.userForm.value.organizationId // Directly assigning organizationId
    };
console.log('Payload being sent to API:', payload); // Debug log to verify payload structure
    if (this.isEditing && this.editingId) {
      // Include ID in the payload for update operations
      const updatePayload = { ...payload, id: this.editingId };
      this.userService.updateUser(this.editingId, updatePayload).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User updated successfully' });
          this.displayDialog = false;
          this.loadUsers(); // Refresh Grid automatically!
        },
        error: (err) => {
          if (err.error && err.error.errors && Array.isArray(err.error.errors)) {
            err.error.errors.forEach((e: any) => {
              this.messageService.add({ severity: 'error', summary: 'Validation Error', detail: `${e.msg}` });
            });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Failed to update user' });
          }
        }
      });
    } else {
      this.userService.createUser(payload).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User created successfully' });
          this.displayDialog = false;
          this.loadUsers(); // Refresh Grid automatically!
        },
        error: (err) => {
          if (err.error && err.error.errors && Array.isArray(err.error.errors)) {
            err.error.errors.forEach((e: any) => {
              this.messageService.add({ severity: 'error', summary: 'Validation Error', detail: `${e.msg}` });
            });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Failed to create user' });
          }
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

  toggleUserStatus(user: any) {
    const newStatus = (user.status === 'ACTIVE' || user.isActive) ? 'INACTIVE' : 'ACTIVE';
    const updatePayload = { 
      id: user.id,
      status: newStatus 
    };
    
    this.userService.updateUser(user.id, updatePayload).subscribe({
      next: () => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Status Updated', 
          detail: `User ${newStatus.toLowerCase()} successfully` 
        });
        this.loadUsers(); // Refresh Grid automatically
      },
      error: (err) => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'Failed to update user status' 
        });
      }
    });
  }

  onFilterChange() {
    this.loadUsers();
  }
   onSearch() {
    this.loadUsers();
  }

}
