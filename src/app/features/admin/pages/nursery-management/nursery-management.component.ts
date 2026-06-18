import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NurseryService } from '../../../../core/services/nursery.service';

@Component({
  selector: 'app-nursery-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './nursery-management.component.html',
  styleUrls: ['./nursery-management.component.css']
})
export class NurseryManagementComponent implements OnInit {
  private nurseryService = inject(NurseryService);

  activeTab: 'nurseries' | 'requests' | 'dispatches' = 'nurseries';
  
  nurseries: any[] = [];
  plantRequests: any[] = [];
  supplyDispatches: any[] = [];
  
  isLoading = false;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    if (this.activeTab === 'nurseries') {
      this.nurseryService.getNurseries().subscribe({
        next: (res) => {
          this.nurseries = res.data || [];
          this.isLoading = false;
        },
        error: () => this.isLoading = false
      });
    } else if (this.activeTab === 'requests') {
      this.nurseryService.getPlantRequests().subscribe({
        next: (res) => {
          this.plantRequests = res.data || [];
          this.isLoading = false;
        },
        error: () => this.isLoading = false
      });
    } else if (this.activeTab === 'dispatches') {
      this.nurseryService.getSupplyDispatches().subscribe({
        next: (res) => {
          this.supplyDispatches = res.data || [];
          this.isLoading = false;
        },
        error: () => this.isLoading = false
      });
    }
  }

  setTab(tab: 'nurseries' | 'requests' | 'dispatches') {
    this.activeTab = tab;
    this.loadData();
  }

  approveRequest(id: string) {
    this.nurseryService.updateRequestStatus(id, 'APPROVED').subscribe(() => this.loadData());
  }

  rejectRequest(id: string) {
    this.nurseryService.updateRequestStatus(id, 'REJECTED').subscribe(() => this.loadData());
  }
}
