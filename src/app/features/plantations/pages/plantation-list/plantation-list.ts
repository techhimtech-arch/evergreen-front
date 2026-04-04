import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { TreeService, ITree } from '../../../../core/services/tree';

@Component({
  selector: 'app-plantation-list',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, ToastModule, RouterModule],
  providers: [MessageService],
  templateUrl: './plantation-list.html',
  styleUrl: './plantation-list.css',
})
export class PlantationList implements OnInit {
  private treeService = inject(TreeService);
  private messageService = inject(MessageService);

  trees: ITree[] = [];
  loading = false;

  ngOnInit() {
    this.loadTrees();
  }

  loadTrees() {
    this.loading = true;
    this.treeService.getTrees().subscribe({
      next: (res) => {
        this.trees = res?.data || res || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching trees', err);
        this.messageService.add({severity:'error', summary:'Error', detail:'Failed to load tree registry'});
        this.loading = false;
      }
    });
  }

  deleteTree(tree: ITree) {
    if (confirm(`Are you sure you want to delete this ${tree.plantType?.name || 'tree'} record?`) && tree._id) {
      this.treeService.deleteTree(tree._id).subscribe({
        next: () => {
          this.messageService.add({severity:'success', summary:'Success', detail:'Tree record deleted successfully'});
          this.loadTrees();
        },
        error: (err) => {
          console.error(err);
          this.messageService.add({severity:'error', summary:'Error', detail:'Failed to delete tree record'});
        }
      });
    }
  }

  viewPhoto(photoUrl: string) {
    if (photoUrl) {
      window.open(photoUrl, '_blank');
    }
  }
}
