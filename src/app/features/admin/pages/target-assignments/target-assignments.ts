import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { AssignmentService, IAssignment } from '../../../../core/services/assignment';
import { GroupService, IGroup } from '../../../../core/services/group';
import { PlantService } from '../../../../core/services/plant';
import { Auth } from '../../../../core/services/auth';

@Component({
  selector: 'app-target-assignments',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    SelectModule,
    MultiSelectModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './target-assignments.html',
  styleUrls: []
})
export class TargetAssignments implements OnInit {
  private fb = inject(FormBuilder);
  private assignmentService = inject(AssignmentService);
  private groupService = inject(GroupService);
  private plantService = inject(PlantService);
  private messageService = inject(MessageService);
  private authService = inject(Auth);

  assignments: IAssignment[] = [];
  displayDialog = false;
  assignmentForm!: FormGroup;
  
  loading = false;
  saving = false;
  totalRecords = 0;

  groupOptions: any[] = [];
  speciesOptions: any[] = [];

  ngOnInit() {
    this.initForm();
    this.loadAssignments();
    this.loadGroups();
    this.loadPlants();
  }

  initForm() {
    this.assignmentForm = this.fb.group({
      groupId: [null, Validators.required],
      targetPlants: [null, [Validators.required, Validators.min(1)]],
      landArea: [null, [Validators.required, Validators.min(0.1)]],
      species: [[]]
    });
  }

  loadAssignments() {
    this.loading = true;
    this.assignmentService.getAssignments().subscribe({
      next: (res) => {
        this.assignments = Array.isArray(res.data) ? res.data : (res.data ? [res.data] : []);
        this.totalRecords = res.count || this.assignments.length;
        this.loading = false;
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load assignments' });
        this.loading = false;
      }
    });
  }

  // Load Groups for Dropdown
  loadGroups() {
    this.groupService.getGroups().subscribe({
      next: (res: any) => {
        this.groupOptions = Array.isArray(res.data) ? res.data : [];
      },
      error: () => console.error('Failed to groups for dropdown.')
    });
  }

  // Load Plants (Species) for MultiSelect
  loadPlants() {
    this.plantService.getPlants().subscribe({
      next: (res: any) => {
        // Assume res.data contains array of plants with commonName/scientificName
        const plants = Array.isArray(res.data) ? res.data : [];
        this.speciesOptions = plants.map((p: any) => ({
             label: p.commonName || p.scientificName,
             value: p.commonName || p.scientificName
        }));
      },
      error: () => console.error('Failed to load plants.')
    });
  }

  showCreateDialog() {
    this.assignmentForm.reset();
    this.displayDialog = true;
  }

  hideDialog() {
    this.displayDialog = false;
  }

  saveAssignment() {
    if (this.assignmentForm.invalid) return;

    this.saving = true;
    const formValue = this.assignmentForm.value;
    
    // Pass currently logged in officer
    const officerId = this.authService.currentUser()?.id || null;

    const payload: Partial<IAssignment> = {
        ...formValue,
        assignedOfficer: officerId
    };

    this.assignmentService.createAssignment(payload).subscribe({
      next: (res) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Target Assigned' });
        this.hideDialog();
        this.loadAssignments();
        this.saving = false;
      },
      error: (err) => {
        const errMsg = err.error?.message || 'Failed to create assignment';
        this.messageService.add({ severity: 'error', summary: 'Error', detail: errMsg });
        this.saving = false;
      }
    });
  }

  viewDetails(assignment: IAssignment) {}
}
