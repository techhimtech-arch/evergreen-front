import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { IInspection, IInspectionFindings, InspectionService } from '../../../../core/services/inspection';
import { GpsService } from '../../../../core/services/gps.service';

@Component({
  selector: 'app-inspection-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule
  ],
  providers: [MessageService],
  template: `
    <div class="inspection-form">
      <div class="inspection-card">
        <h2>पेड़ निरीक्षण - {{ inspection?.tree?.location || 'Unknown Location' }}</h2>
        <form [formGroup]="inspectionForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="treeStatus">पेड़ की स्थिति</label>
            <select id="treeStatus" formControlName="treeStatus" class="form-control">
              <option value="">चुनें</option>
              <option *ngFor="let option of treeStatusOptions" [value]="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="healthScore">स्वास्थ्य स्कोर (1-10): {{ inspectionForm.get('healthScore')?.value }}</label>
            <input 
              id="healthScore"
              type="range" 
              min="1" 
              max="10" 
              formControlName="healthScore"
              class="form-range"
            />
          </div>

          <div class="form-group">
            <label for="growthStage">विकास अवस्था</label>
            <select id="growthStage" formControlName="growthStage" class="form-control">
              <option value="">चुनें</option>
              <option *ngFor="let option of growthStageOptions" [value]="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="remarks">टिप्पणियां</label>
            <textarea 
              id="remarks"
              formControlName="remarks"
              placeholder="पेड़ की स्थिति के बारे में विस्तृत जानकारी..."
              rows="4"
              class="form-textarea"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="photos">फोटो अपलोड करें</label>
            <input 
              id="photos"
              type="file" 
              multiple 
              accept="image/*"
              (change)="onPhotoSelect($event)"
              class="form-file"
            />
            <div *ngIf="uploadedPhotos.length > 0" class="uploaded-photos">
              <div *ngFor="let photo of uploadedPhotos; let i = index" class="photo-item">
                <img [src]="photo.url" [alt]="photo.caption" class="photo-thumbnail" />
                <span>{{ photo.caption }}</span>
                <button type="button" (click)="removePhoto(i)" class="remove-photo">×</button>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <p-button 
              type="submit" 
              [label]="loading ? 'सबमिट हो रहा है...' : 'निरीक्षण पूरा करें'"
              [loading]="loading"
              [disabled]="inspectionForm.invalid || loading"
            />
            <button 
              type="button"
              (click)="getCurrentLocation()"
              [disabled]="locationLoading"
              class="location-btn"
            >
              {{ locationLoading ? 'GPS लोड हो रहा है...' : 'GPS लोकेशन प्राप्त करें' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .inspection-form {
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
    }

    .inspection-card {
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .inspection-card h2 {
      margin-top: 0;
      color: #2c3e50;
      text-align: center;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #2c3e50;
    }

    .form-control, .form-textarea, .form-range, .form-file {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
    }

    .form-textarea {
      resize: vertical;
    }

    .uploaded-photos {
      margin-top: 1rem;
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .photo-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #f8f9fa;
      padding: 0.5rem;
      border-radius: 4px;
      position: relative;
    }

    .photo-thumbnail {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border-radius: 4px;
    }

    .remove-photo {
      background: #e74c3c;
      color: white;
      border: none;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      cursor: pointer;
      font-size: 12px;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }

    .location-btn {
      padding: 10px 20px;
      background: #3498db;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
    }

    .location-btn:hover {
      background: #2980b9;
    }

    .location-btn:disabled {
      background: #bdc3c7;
      cursor: not-allowed;
    }
  `]
})
export class InspectionFormComponent {
  @Input() inspection: IInspection | null = null;
  @Output() onComplete = new EventEmitter<void>();

  inspectionForm: FormGroup;
  loading = false;
  locationLoading = false;
  uploadedPhotos: Array<{ url: string; caption: string }> = [];

  treeStatusOptions = [
    { label: 'स्वस्थ', value: 'HEALTHY' },
    { label: 'कमजोर', value: 'WEAK' },
    { label: 'रोगग्रस्त', value: 'DISEASED' },
    { label: 'मरा हुआ', value: 'DEAD' }
  ];

  growthStageOptions = [
    { label: 'अंकुर', value: 'SEEDLING' },
    { label: 'पौधा', value: 'SAPLING' },
    { label: 'युवा', value: 'YOUNG' },
    { label: 'परिपक्व', value: 'MATURE' }
  ];

  constructor(
    private fb: FormBuilder,
    private inspectionService: InspectionService,
    private gpsService: GpsService,
    private messageService: MessageService
  ) {
    this.inspectionForm = this.fb.group({
      treeStatus: ['', Validators.required],
      healthScore: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
      growthStage: ['', Validators.required],
      remarks: [''],
      photos: [[]],
      latitude: [null],
      longitude: [null],
      location: ['']
    });
  }

  onSubmit(): void {
    if (this.inspectionForm.invalid || !this.inspection) {
      return;
    }

    this.loading = true;
    const formData = this.inspectionForm.value;

    const inspectionData: IInspectionFindings = {
      treeStatus: formData.treeStatus,
      healthScore: formData.healthScore,
      growthStage: formData.growthStage,
      remarks: formData.remarks,
      photos: this.uploadedPhotos
    };

    // Add location data if available
    if (formData.latitude && formData.longitude) {
      Object.assign(inspectionData, {
        latitude: formData.latitude,
        longitude: formData.longitude,
        location: formData.location || 'GPS location confirmed'
      });
    }

    this.inspectionService.completeInspection(this.inspection.id, inspectionData)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'सफल',
            detail: 'निरीक्षण सफलतापूर्वक पूरा किया गया'
          });
          this.onComplete.emit();
        },
        error: (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'विफल',
            detail: 'निरीक्षण पूरा करने में विफल: ' + error.message
          });
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  onPhotoSelect(event: any): void {
    const files = event.files;
    // In a real implementation, you would upload these files to cloud storage
    // For now, we'll simulate with placeholder URLs
    files.forEach((file: File, index: number) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.uploadedPhotos.push({
          url: e.target.result,
          caption: `फोटो ${index + 1}`
        });
      };
      reader.readAsDataURL(file);
    });
  }

  removePhoto(index: number): void {
    this.uploadedPhotos.splice(index, 1);
  }

  getCurrentLocation(): void {
    this.locationLoading = true;
    this.gpsService.getCurrentLocation()
      .then((position: any) => {
        this.inspectionForm.patchValue({
          latitude: position.latitude,
          longitude: position.longitude,
          location: `GPS: ${position.latitude.toFixed(6)}, ${position.longitude.toFixed(6)}`
        });
        this.messageService.add({
          severity: 'success',
          summary: 'सफल',
          detail: 'GPS लोकेशन प्राप्त की गई'
        });
      })
      .catch((error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'विफल',
          detail: 'GPS लोकेशन प्राप्त करने में विफल: ' + error.message
        });
      })
      .finally(() => {
        this.locationLoading = false;
      });
  }
}
