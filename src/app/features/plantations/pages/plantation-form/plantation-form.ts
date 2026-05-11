import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { TreeService, ITree } from '../../../../core/services/tree';
import { PlantService, IPlant } from '../../../../core/services/plant';
import { EventService } from '../../../../core/services/event';
import { GpsService } from '../../../../core/services/gps.service';

@Component({
  selector: 'app-plantation-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    InputTextModule, 
    SelectModule, 
    ButtonModule, 
    ToastModule,
    FileUploadModule,
    RouterModule
  ],
  providers: [MessageService],
  templateUrl: './plantation-form.html',
  styleUrl: './plantation-form.css',
})
export class PlantationForm implements OnInit {
  private fb = inject(FormBuilder);
  private treeService = inject(TreeService);
  private plantService = inject(PlantService);
  private eventService = inject(EventService);
  private gpsService = inject(GpsService);
  private messageService = inject(MessageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  treeForm: FormGroup;
  isEditMode = false;
  currentTreeId: string | null = null;
  isGpsLoading = signal(false);
  gpsAccuracy = signal<number | null>(null);
  selectedFile = signal<File | null>(null);

  plants: IPlant[] = [];
  events: any[] = []; // Plantation events

  statuses = [
    { label: 'Planted', value: 'PLANTED' },
    { label: 'Growing', value: 'GROWING' },
    { label: 'Dead', value: 'DEAD' }
  ];

  constructor() {
    this.treeForm = this.fb.group({
      plantTypeId: [null, Validators.required],
      eventId: [null],
      location: ['', Validators.required],
      latitude: [null, Validators.required],
      longitude: [null, Validators.required],
      photo: [''],
      status: ['PLANTED']
    });
  }

  ngOnInit() {
    this.loadDependencies();
    
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.currentTreeId = id;
        this.loadTree(id);
      }
    });
  }

  loadDependencies() {
    this.plantService.getPlants().subscribe(res => {
      this.plants = res?.data || res || [];
    });

    this.eventService.getEvents().subscribe(res => {
      this.events = res?.data || res || [];
    });
  }

  loadTree(id: string) {
    this.treeService.getTrees().subscribe({
      next: (res) => {
        const trees = res?.data || res || [];
        const tree = trees.find((t: any) => t._id === id);
        if (tree) {
          this.treeForm.patchValue({
            plantTypeId: tree.plantTypeId,
            eventId: tree.eventId,
            location: tree.location,
            latitude: tree.latitude,
            longitude: tree.longitude,
            photo: tree.photo,
            status: tree.status
          });
        }
      },
      error: (err) => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Could not fetch tree details'});
      }
    });
  }

  async captureGpsLocation() {
    this.isGpsLoading.set(true);
    this.gpsAccuracy.set(null);
    try {
      const location = await this.gpsService.getCurrentLocation();
      this.treeForm.patchValue({
        latitude: location.latitude,
        longitude: location.longitude
      });
      this.gpsAccuracy.set(location.accuracy || null);
      this.messageService.add({
        severity: 'success', 
        summary: 'Success', 
        detail: `GPS coordinates captured (Accuracy: ${location.accuracy?.toFixed(2)}m)`
      });
    } catch (error: any) {
      this.messageService.add({
        severity: 'error', 
        summary: 'GPS Error', 
        detail: error?.message || 'Could not get current location. Please check permissions.'
      });
    } finally {
      this.isGpsLoading.set(false);
    }
  }

  onFileSelect(event: any) {
    const files: FileList = event.files;
    if (files && files.length > 0) {
      const file = files[0];
      this.selectedFile.set(file);
      this.treeForm.patchValue({
        photo: file.name // Store filename for now, you may want to upload to cloud storage
      });
      this.messageService.add({
        severity: 'info',
        summary: 'File Selected',
        detail: `${file.name} selected (${(file.size / 1024).toFixed(2)} KB)`
      });
    }
  }

  saveTree() {
    if (this.treeForm.invalid) return;

    const formValue = this.treeForm.value;

    if (this.isEditMode && this.currentTreeId) {
      // Update tree
      this.treeService.updateTree(this.currentTreeId, formValue).subscribe({
        next: () => {
          this.messageService.add({severity: 'success', summary: 'Success', detail: 'Tree record updated successfully'});
          setTimeout(() => this.router.navigate(['..']), 1000);
        },
        error: (err) => {
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'Could not update tree record'});
        }
      });
    } else {
      this.treeService.createTree(formValue).subscribe({
        next: () => {
          this.messageService.add({severity: 'success', summary: 'Success', detail: 'Tree logged successfully'});
          setTimeout(() => this.router.navigate(['..']), 1000);
        },
        error: (err) => {
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'Could not log tree'});
        }
      });
    }
  }
}


