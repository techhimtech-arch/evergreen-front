import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { OrganizationService, IOrganization } from '../../../../core/services/organization';

@Component({
  selector: 'app-organization-management',
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
    SelectModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './organization-management.html',
  styleUrls: ['./organization-management.css']
})
export class OrganizationManagement implements OnInit {
  private fb = inject(FormBuilder);
  private orgService = inject(OrganizationService);
  private messageService = inject(MessageService);

  organizations: IOrganization[] = [];
  displayDialog: boolean = false;
  orgForm!: FormGroup;
  isEditMode: boolean = false;
  currentOrgId: string | null = null;
  loading: boolean = false;
  totalRecords: number = 0;

  orgTypes = [
    { label: 'NGO', value: 'NGO' },
    { label: 'Government', value: 'GOVERNMENT' },
    { label: 'School', value: 'SCHOOL' },
    { label: 'CSR', value: 'CSR' }
  ];

  statusOptions = [
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Suspended', value: 'SUSPENDED' },
    { label: 'Inactive', value: 'INACTIVE' }
  ];

  ngOnInit() {
    this.initForm();
    this.loadOrganizations();
  }

  initForm() {
    this.orgForm = this.fb.group({
      name: ['', Validators.required],
      slug: ['', Validators.required],
      organizationType: ['NGO', Validators.required],
      description: [''],
      contactEmail: ['', [Validators.required, Validators.email]],
      contactPhone: ['', [Validators.required]],
      address: [''],
      status: ['ACTIVE']
    });
  }

  loadOrganizations() {
    this.loading = true;
    this.orgService.getOrganizations({ page: 1, limit: 10 }).subscribe({
      next: (res) => {
        this.organizations = res.data || res; // Handle based on actual response wrapper
        this.totalRecords = res.total || this.organizations.length;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load organizations' });
        console.error(err);
      }
    });
  }

  showCreateDialog() {
    this.isEditMode = false;
    this.currentOrgId = null;
    this.orgForm.reset({ organizationType: 'NGO', status: 'ACTIVE' });
    this.displayDialog = true;
  }

  showEditDialog(org: IOrganization) {
    this.isEditMode = true;
    this.currentOrgId = org.id!;
    this.orgForm.patchValue({
      name: org.name,
      slug: org.slug,
      organizationType: org.organizationType,
      description: org.description,
      contactEmail: org.contactEmail,
      contactPhone: org.contactPhone,
      address: org.address,
      status: org.status
    });
    this.displayDialog = true;
  }

  hideDialog() {
    this.displayDialog = false;
  }

  saveOrganization() {
    if (this.orgForm.invalid) {
      return;
    }

    const payload = this.orgForm.value;

    if (this.isEditMode && this.currentOrgId) {
      this.orgService.updateOrganization(this.currentOrgId, payload).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Organization updated' });
          this.loadOrganizations();
          this.hideDialog();
        },
        error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Update failed' })
      });
    } else {
      this.orgService.createOrganization(payload).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Organization created' });
          this.loadOrganizations();
          this.hideDialog();
        },
        error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Creation failed' })
      });
    }
  }

  toggleStatus(org: IOrganization) {
    const newStatus = org.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    this.orgService.toggleOrganizationStatus(org.id!, newStatus).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: `Status changed to ${newStatus}` });
        this.loadOrganizations();
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update status' })
    });
  }
}

