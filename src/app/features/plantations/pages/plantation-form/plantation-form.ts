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
import { AssignmentService, IAssignment } from '../../../../core/services/assignment';

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
  private assignmentService = inject(AssignmentService);
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
  assignments: IAssignment[] = [];

  statuses = [
    { label: 'Planted', value: 'PLANTED' },
    { label: 'Growing', value: 'GROWING' },
    { label: 'Dead', value: 'DEAD' }
  ];

  constructor() {
    this.treeForm = this.fb.group({
      assignmentId: [null, Validators.required],
      speciesId: [null, Validators.required],
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

    this.assignmentService.getAssignments().subscribe(res => {
      this.assignments = (res?.data || res || []) as IAssignment[];
    });
  }

  loadTree(id: string) {
    this.treeService.getTree(id).subscribe({
      next: (res) => {
        const tree = res?.data || res;
        if (tree) {
          this.treeForm.patchValue({
            assignmentId: this.getId(tree.assignmentId),
            speciesId: this.getId(tree.speciesId),
            eventId: this.getId(tree.eventId),
            location: tree.location,
            latitude: tree.latitude,
            longitude: tree.longitude,
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

  async saveTree() {
    if (this.treeForm.invalid) return;

    const formValue = this.treeForm.value;
    const assignment = this.assignments.find(a => a._id === formValue.assignmentId);
    const groupId = this.getId(assignment?.groupId);

    if (!groupId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Missing Group',
        detail: 'Selected assignment does not include a group. Please update the assignment first.'
      });
      return;
    }

    const payload: Partial<ITree> = {
      ...formValue,
      groupId
    };
    delete (payload as any).photo;

    const photoUrl = await this.readSelectedPhoto();
    if (photoUrl) {
      payload.photos = [{
        url: photoUrl,
        caption: `Plantation photo captured at ${formValue.location}`,
        uploadedAt: new Date()
      }];
    }

    if (this.isEditMode && this.currentTreeId) {
      // Update tree
      this.treeService.updateTree(this.currentTreeId, payload).subscribe({
        next: () => {
          this.messageService.add({severity: 'success', summary: 'Success', detail: 'Tree record updated successfully'});
          setTimeout(() => this.router.navigate(['..']), 1000);
        },
        error: (err) => {
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'Could not update tree record'});
        }
      });
    } else {
      this.treeService.createTree(payload as ITree).subscribe({
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

  private getId(value: any): string | null {
    if (!value) return null;
    return typeof value === 'string' ? value : value._id || value.id || null;
  }

  private readSelectedPhoto(): Promise<string | null> {
    const file = this.selectedFile();
    if (!file) return Promise.resolve(null);

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }
}


