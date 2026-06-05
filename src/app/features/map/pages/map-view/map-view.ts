import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { TreeService } from '../../../../core/services/tree';

@Component({
  selector: 'app-map-view',
  imports: [CommonModule],
  templateUrl: './map-view.html',
  styleUrl: './map-view.css',
})
export class MapView implements OnInit {
  private treeService = inject(TreeService);

  markers = signal<any[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.treeService.getTreeMapData().subscribe({
      next: (res) => {
        this.markers.set(res?.data || res || []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load geotagged plantation data.');
        this.loading.set(false);
      }
    });
  }

  statusClass(status: string): string {
    return `status-${(status || 'unknown').toLowerCase()}`;
  }
}
