import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { TreeService, ITree } from '../../../../core/services/tree';
import { PlantService, IPlant } from '../../../../core/services/plant';
// Assuming an Event service exists for Plantation Events, if not we will mock or bypass for now
// import { EventService } from '../../../../core/services/event';

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
  private messageService = inject(MessageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  treeForm: FormGroup;
  isEditMode = false;
  currentTreeId: string | null = null;

  plants: IPlant[] = [];
  events: any[] = []; // Placeholder until Event API is complete

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
    // Load events when service ready
  }

  loadTree(id: string) {
    this.treeService.getTrees().subscribe({ // Using get list since we don't have getById right now, or we can just fetch all and filter
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

