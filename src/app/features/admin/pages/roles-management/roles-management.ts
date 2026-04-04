import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { RoleService, IRole } from '../../../../core/services/role';

@Component({
  selector: 'app-roles-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    MultiSelectModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './roles-management.html',
  styleUrls: ['./roles-management.css']
})
export class RolesManagement implements OnInit {
  private fb = inject(FormBuilder);
  private roleService = inject(RoleService);
  private messageService = inject(MessageService);

  roles: IRole[] = [];
  permissions: any[] = [];
  displayDialog: boolean = false;
  roleForm!: FormGroup;
  isEditMode: boolean = false;
  currentRoleId: string | null = null;
  loading: boolean = false;

  getRoles() {
    this.loading = true;
    this.roleService.getRoles().subscribe({
      next: (res: any) => {
        this.roles = res.data || res.results || res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch roles' });
      }
    });
  }

  getPermissions() {
    this.roleService.getPermissions().subscribe({
      next: (res: any) => {
        const permsData = res.data || res.results || res;
        if (permsData.length > 0 && typeof permsData[0] === 'string') {
          this.permissions = permsData.map((p: string) => ({ label: p, value: p }));
        } else if (permsData.length > 0 && typeof permsData[0] === 'object') {
          this.permissions = permsData.map((p: any) => ({ label: p.name || p.action || p.id || 'N/A', value: p.id || p.value || p.name || p.action }));
        }
      },
      error: () => {
        this.permissions = [
          { label: 'Read Users', value: 'users:read' },
          { label: 'Manage Users', value: 'users:manage' },
          { label: 'Manage Fees', value: 'fees:manage' },
          { label: 'Manage Roles', value: 'roles:manage' }
        ];
      }
    });
  }

  ngOnInit() {
    this.initForm();
    this.getRoles();
    this.getPermissions();
  }

  initForm() {
    this.roleForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      permissions: [[], Validators.required]
    });
  }

  showCreateDialog() {
    this.isEditMode = false;
    this.currentRoleId = null;
    this.roleForm.reset({ permissions: [] });
    this.displayDialog = true;
  }

  showEditDialog(role: IRole) {
    this.isEditMode = true;
    this.currentRoleId = role.id!;
    this.roleForm.patchValue({
      name: role.name,
      description: role.description,
      permissions: role.permissions || []
    });
    this.displayDialog = true;
  }

  hideDialog() {
    this.displayDialog = false;
  }

  saveRole() {
    if (this.roleForm.invalid) {
      return;
    }

    const payload = this.roleForm.value;

    if (this.isEditMode && this.currentRoleId) {
      this.roleService.updateRole(this.currentRoleId, payload).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Role updated successfully' });
          this.getRoles();
          this.hideDialog();
        },
        error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update role' })
      });
    } else {
      this.roleService.createRole(payload).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Role created successfully' });
          this.getRoles();
          this.hideDialog();
        },
        error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create role' })
      });
    }
  }

  deleteRole(role: IRole) {
    if(confirm('Are you sure to delete this role?')) {
      this.roleService.deleteRole(role.id!).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Role deleted' });
          this.getRoles();
        },
        error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete role' })
      });
    }
  }
}
