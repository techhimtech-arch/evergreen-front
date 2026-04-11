import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { InspectionService, IInspection } from '../../../../../../src/app/core/services/inspection';

@Component({
  selector: 'app-pending-inspections',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    TableModule,
    TagModule
  ],
  providers: [MessageService],
  template: `
    <div class="pending-inspections">
      <div class="header">
        <h1>मेरे लंबित निरीक्षण</h1>
        <p-button 
          label="रीफ्रेश करें" 
          icon="pi pi-refresh" 
          (click)="loadInspections()"
          [loading]="loading"
        />
      </div>

      <div class="inspections-list" *ngIf="!loading">
        <div *ngIf="inspections.length === 0" class="no-data">
          <p>कोई लंबित निरीक्षण नहीं मिले</p>
        </div>

        <div *ngFor="let inspection of inspections" class="inspection-card">
          <p-card>
            <div class="inspection-header">
              <h3>{{ inspection.tree?.location || 'Unknown Location' }}</h3>
              <p-tag 
                [value]="getPriorityLabel(inspection.priority)" 
                [severity]="getPrioritySeverity(inspection.priority)"
              />
            </div>
            
            <div class="inspection-details">
              <p><strong>निर्धारित तिथि:</strong> {{ formatDate(inspection.scheduledDate) }}</p>
              <p><strong>स्थिति:</strong> {{ getStatusLabel(inspection.status) }}</p>
              <p *ngIf="inspection.tree?.species"><strong>प्रजाति:</strong> {{ inspection.tree.species }}</p>
            </div>

            <div class="inspection-actions">
              <p-button 
                label="निरीक्षण करें" 
                icon="pi pi-check"
                (click)="startInspection(inspection)"
                severity="success"
              />
              <p-button 
                label="विवरण देखें" 
                icon="pi pi-eye"
                (click)="viewDetails(inspection)"
                severity="info"
              />
            </div>
          </p-card>
        </div>
      </div>

      <div *ngIf="loading" class="loading">
        <p>लोड हो रहा है...</p>
      </div>
    </div>
  `,
  styles: [`
    .pending-inspections {
      padding: 20px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .header h1 {
      margin: 0;
      color: #2c3e50;
    }

    .inspections-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 1.5rem;
    }

    .inspection-card {
      height: 100%;
    }

    .inspection-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .inspection-header h3 {
      margin: 0;
      color: #2c3e50;
    }

    .inspection-details {
      margin-bottom: 1.5rem;
    }

    .inspection-details p {
      margin: 0.5rem 0;
      color: #555;
    }

    .inspection-actions {
      display: flex;
      gap: 0.5rem;
    }

    .no-data {
      text-align: center;
      padding: 3rem;
      color: #666;
    }

    .loading {
      text-align: center;
      padding: 3rem;
      color: #666;
    }
  `]
})
export class PendingInspectionsComponent implements OnInit {
  inspections: IInspection[] = [];
  loading = false;

  constructor(
    private inspectionService: InspectionService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadInspections();
  }

  loadInspections(): void {
    this.loading = true;
    this.inspectionService.getMyPendingInspections()
      .subscribe({
        next: (response: any) => {
          this.inspections = response.data || [];
        },
        error: (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'विफल',
            detail: 'निरीक्षण लोड करने में विफल: ' + error.message
          });
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  startInspection(inspection: IInspection): void {
    // Navigate to inspection form
    // This would typically use router navigation
    console.log('Starting inspection for:', inspection);
  }

  viewDetails(inspection: IInspection): void {
    // Show inspection details dialog
    console.log('Viewing details for:', inspection);
  }

  getPriorityLabel(priority: string): string {
    const labels: { [key: string]: string } = {
      'LOW': 'कम',
      'MEDIUM': 'मध्यम',
      'HIGH': 'उच्च',
      'CRITICAL': 'गंभीर'
    };
    return labels[priority] || priority;
  }

  getPrioritySeverity(priority: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | null {
    const severities: { [key: string]: 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | null } = {
      'LOW': 'success',
      'MEDIUM': 'warn',
      'HIGH': 'danger',
      'CRITICAL': 'danger'
    };
    return severities[priority] || 'info';
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'PENDING': 'लंबित',
      'IN_PROGRESS': 'प्रगति में',
      'COMPLETED': 'पूर्ण',
      'MISSED': 'छूट गया'
    };
    return labels[status] || status;
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('hi-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
