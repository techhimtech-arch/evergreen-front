import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { RatingModule } from 'primeng/rating';
import { TextareaModule } from 'primeng/textarea';
import { FileUploadModule } from 'primeng/fileupload';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';

import { TreeService } from '../../../../core/services/tree';

@Component({
  selector: 'app-survival-update',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    ToastModule,
    CardModule,
    RatingModule,
    TextareaModule,
    FileUploadModule
  ],
  providers: [MessageService],
  templateUrl: './survival-update.html',
  styleUrl: './survival-update.css',
})
export class SurvivalUpdate implements OnInit {
  private fb = inject(FormBuilder);
  private treeService = inject(TreeService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  survivalForm: FormGroup;
  trees: any[] = [];
  selectedFile = signal<File | null>(null);
  isLoading = signal(false);

  healthStatuses = [
    { label: 'Excellent', value: 'EXCELLENT' },
    { label: 'Good', value: 'GOOD' },
    { label: 'Fair', value: 'FAIR' },
    { label: 'Poor', value: 'POOR' },
    { label: 'Dead', value: 'DEAD' }
  ];

  constructor() {
    this.survivalForm = this.fb.group({
      treeId: [null, Validators.required],
      healthScore: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
      healthStatus: [null, Validators.required],
      remarks: ['', [Validators.required, Validators.minLength(5)]],
      photo: ['']
    });
  }

  ngOnInit() {
    this.loadTrees();
  }

  loadTrees() {
    this.treeService.getTrees().subscribe({
      next: (res) => {
        this.trees = res?.data || res || [];
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not load trees'
        });
      }
    });
  }

  onFileSelect(event: any) {
    const files: FileList = event.files;
    if (files && files.length > 0) {
      const file = files[0];
      this.selectedFile.set(file);
      this.survivalForm.patchValue({
        photo: file.name
      });
      this.messageService.add({
        severity: 'info',
        summary: 'File Selected',
        detail: `${file.name} selected (${(file.size / 1024).toFixed(2)} KB)`
      });
    }
  }

  submitUpdate() {
    if (this.survivalForm.invalid) {
      this.survivalForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const formValue = this.survivalForm.value;
    const selectedTree = this.trees.find(t => t._id === formValue.treeId);
    const treeId = formValue.treeId as string;

    this.treeService.updateTreeHealth(treeId, {
      status: formValue.healthStatus,
      growthStage: selectedTree?.growthStage,
      healthRemarks: formValue.remarks
    }).subscribe({
      next: (_res: any) => {
        this.isLoading.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Tree health update recorded successfully'
        });
        setTimeout(() => {
          this.router.navigate(['/plantations/list']);
        }, 1500);
      },
      error: (_err: any) => {
        this.isLoading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not save health update'
        });
      }
    });
  }

  resetForm() {
    this.survivalForm.reset({
      healthScore: 5,
      healthStatus: null,
      remarks: '',
      photo: ''
    });
    this.selectedFile.set(null);
  }
}

