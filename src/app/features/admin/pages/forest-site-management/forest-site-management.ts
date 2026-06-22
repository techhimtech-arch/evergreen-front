import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ForestSiteService, IForestSite } from '../../../../core/services/forest-site.service';

@Component({
  selector: 'app-forest-site-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    DialogModule,
    SelectModule,
    TextareaModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './forest-site-management.html'
})
export class ForestSiteManagement implements OnInit {
  private fb = inject(FormBuilder);
  private forestSiteService = inject(ForestSiteService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  sites: IForestSite[] = [];
  loading = false;
  
  siteDialog = false;
  siteForm!: FormGroup;
  isEditMode = false;
  currentSiteId = '';

  statuses = [
    { label: 'Available', value: 'AVAILABLE' },
    { label: 'Under Review', value: 'UNDER_REVIEW' },
    { label: 'Adopted', value: 'ADOPTED' },
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Suspended', value: 'SUSPENDED' }
  ];

  ngOnInit() {
    this.initForm();
    this.loadSites();
  }

  initForm() {
    this.siteForm = this.fb.group({
      siteCode: ['', Validators.required],
      siteName: ['', Validators.required],
      areaHectare: [0, [Validators.required, Validators.min(0.1)]],
      district: [''],
      village: [''],
      division: [''],
      range: [''],
      estimatedCost: [0],
      status: ['AVAILABLE', Validators.required],
      description: ['']
    });
  }

  loadSites() {
    this.loading = true;
    this.forestSiteService.getSites().subscribe({
      next: (res) => {
        this.sites = res.data || [];
        this.loading = false;
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load forest sites' });
        this.loading = false;
      }
    });
  }

  openNew() {
    this.siteForm.reset({ status: 'AVAILABLE' });
    this.isEditMode = false;
    this.currentSiteId = '';
    this.siteDialog = true;
  }

  editSite(site: IForestSite) {
    this.isEditMode = true;
    this.currentSiteId = site._id!;
    this.siteForm.patchValue(site);
    this.siteDialog = true;
  }

  hideDialog() {
    this.siteDialog = false;
  }

  saveSite() {
    if (this.siteForm.invalid) {
      this.siteForm.markAllAsTouched();
      return;
    }

    const payload = this.siteForm.value;

    if (this.isEditMode) {
      this.forestSiteService.updateSite(this.currentSiteId, payload).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Site Updated' });
          this.loadSites();
          this.hideDialog();
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Failed to update site' });
        }
      });
    } else {
      this.forestSiteService.createSite(payload).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Site Created' });
          this.loadSites();
          this.hideDialog();
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Failed to create site' });
        }
      });
    }
  }

  deleteSite(site: IForestSite) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + site.siteName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.forestSiteService.deleteSite(site._id!).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Site Deleted' });
            this.loadSites();
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete site' });
          }
        });
      }
    });
  }
}
