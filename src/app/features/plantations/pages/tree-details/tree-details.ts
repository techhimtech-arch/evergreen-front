import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TreeService, ITree } from '../../../../core/services/tree';
import { TreeMonitoringService, ITimelineItem, ITreePhoto } from '../../../../core/services/tree-monitoring.service';
import { TimelineModule } from 'primeng/timeline';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { GalleriaModule } from 'primeng/galleria';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-tree-details',
  standalone: true,
  imports: [
    CommonModule,
    TimelineModule,
    CardModule,
    ButtonModule,
    ImageModule,
    GalleriaModule,
    ProgressSpinnerModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './tree-details.html',
  styleUrls: ['./tree-details.css']
})
export class TreeDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private treeService = inject(TreeService);
  private monitoringService = inject(TreeMonitoringService);
  private messageService = inject(MessageService);

  treeId = '';
  tree: ITree | null = null;
  timeline: ITimelineItem[] = [];
  photos: ITreePhoto[] = [];
  
  loading = true;
  responsiveOptions: any[] = [];
  backendUrl = environment.apiUrl.replace('/api/v1', ''); // Get base domain

  ngOnInit() {
    this.responsiveOptions = [
        { breakpoint: '1024px', numVisible: 5 },
        { breakpoint: '768px', numVisible: 3 },
        { breakpoint: '560px', numVisible: 1 }
    ];

    this.route.params.subscribe(params => {
      this.treeId = params['id'];
      if (this.treeId) {
        this.loadTreeData();
      }
    });
  }

  loadTreeData() {
    this.loading = true;
    
    // 1. Get Tree Basic Details
    this.treeService.getTree(this.treeId).subscribe({
      next: (res) => {
        this.tree = res.data;
        this.loadTimeline();
        this.loadPhotos();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load tree details' });
        this.loading = false;
      }
    });
  }

  loadTimeline() {
    this.monitoringService.getTreeTimeline(this.treeId).subscribe({
      next: (res) => {
        this.timeline = res.data || [];
        // Map icon based on type
        this.timeline = this.timeline.map(item => {
           let icon = 'pi pi-info-circle';
           let color = '#9C27B0';
           
           if(item.type === 'photo') { icon = 'pi pi-image'; color = '#673AB7'; }
           if(item.type === 'event') { icon = 'pi pi-calendar'; color = '#FF9800'; }
           if(item.type === 'inspection') { icon = 'pi pi-check-square'; color = '#4CAF50'; }

           return { ...item, icon, color };
        });
      },
      error: () => {
        console.error('Failed to load timeline');
      }
    });
  }

  loadPhotos() {
    this.monitoringService.getTreePhotos(this.treeId).subscribe({
      next: (res) => {
        this.photos = res.data || [];
        // Fix URLs if they are relative paths
        this.photos.forEach(p => {
           if(p.url && p.url.startsWith('/')) {
             p.url = this.backendUrl + p.url;
           }
        });
        this.loading = false;
      },
      error: () => {
        console.error('Failed to load photos');
        this.loading = false;
      }
    });
  }
}
