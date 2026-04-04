import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { PlantService, IPlant } from '../../../../core/services/plant';

@Component({
  selector: 'app-species-management',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    SelectModule,
    TextareaModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './species-management.html',
  styleUrl: './species-management.css',
})
export class SpeciesManagement implements OnInit {
  private plantService = inject(PlantService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  plants: IPlant[] = [];
  loading = false;
  displayDialog = false;
  isEditMode = false;
  plantForm: FormGroup;
  currentPlantId: string | null = null;

  categories = [
    { label: 'Forest', value: 'FOREST' },
    { label: 'Fruit', value: 'FRUIT' },
    { label: 'Medicinal', value: 'MEDICINAL' },
    { label: 'Ornamental', value: 'ORNAMENTAL' }
  ];

  constructor() {
    this.plantForm = this.fb.group({
      name: ['', Validators.required],
      scientificName: ['', Validators.required],
      category: ['FOREST', Validators.required],
      description: [''],
      image: ['']
    });
  }

  ngOnInit() {
    this.loadPlants();
  }

  loadPlants() {
    this.loading = true;
    this.plantService.getPlants().subscribe({
      next: (res) => {
        this.plants = res?.data || res || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching plants', err);
        this.messageService.add({severity:'error', summary:'Error', detail:'Failed to load plant catalog'});
        this.loading = false;
      }
    });
  }

  showCreateDialog() {
    this.isEditMode = false;
    this.currentPlantId = null;
    this.plantForm.reset({ category: 'FOREST' });
    this.displayDialog = true;
  }

  showEditDialog(plant: IPlant) {
    this.isEditMode = true;
    this.currentPlantId = plant._id || null;
    this.plantForm.patchValue({
      name: plant.name,
      scientificName: plant.scientificName,
      category: plant.category,
      description: plant.description,
      image: plant.image
    });
    this.displayDialog = true;
  }

  hideDialog() {
    this.displayDialog = false;
  }

  savePlant() {
    if (this.plantForm.invalid) return;

    const plantData = this.plantForm.value;

    if (this.isEditMode && this.currentPlantId) {
      this.plantService.updatePlant(this.currentPlantId, plantData).subscribe({
        next: () => {
          this.messageService.add({severity:'success', summary:'Success', detail:'Plant species updated successfully'});
          this.hideDialog();
          this.loadPlants();
        },
        error: (err) => {
          console.error(err);
          this.messageService.add({severity:'error', summary:'Error', detail:'Failed to update plant species'});
        }
      });
    } else {
      this.plantService.createPlant(plantData).subscribe({
        next: () => {
          this.messageService.add({severity:'success', summary:'Success', detail:'Plant species added to catalog successfully'});
          this.hideDialog();
          this.loadPlants();
        },
        error: (err) => {
          console.error(err);
          this.messageService.add({severity:'error', summary:'Error', detail:'Failed to add plant species'});
        }
      });
    }
  }

  deletePlant(plant: IPlant) {
    if (confirm(`Are you sure you want to delete ${plant.name}?`) && plant._id) {
      this.plantService.deletePlant(plant._id).subscribe({
        next: () => {
          this.messageService.add({severity:'success', summary:'Success', detail:'Plant deleted successfully'});
          this.loadPlants();
        },
        error: (err) => {
          console.error(err);
          this.messageService.add({severity:'error', summary:'Error', detail:'Failed to delete plant'});
        }
      });
    }
  }
}
