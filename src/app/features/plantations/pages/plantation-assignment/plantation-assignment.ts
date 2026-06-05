import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { TooltipModule } from 'primeng/tooltip';
import { AssignmentService, IAssignment } from '../../../../core/services/assignment';
import { GroupService, IGroup } from '../../../../core/services/group';
import { PlantService, IPlant } from '../../../../core/services/plant';
import { User } from '../../../../core/services/user';

export interface AssignmentModel {
  id: string;
  groupId: string;
  landArea: number;
  targetPlants: number;
  species: string;
  assignedDate: Date;
  assignedOfficer: string;
  status: 'Pending' | 'In Progress' | 'Completed';
}

@Component({
  selector: 'app-plantation-assignment',
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
    InputNumberModule,
    TooltipModule
  ],
  templateUrl: './plantation-assignment.html',
  styleUrls: ['./plantation-assignment.css']
})
export class PlantationAssignment implements OnInit {
  private fb = inject(FormBuilder);
  private assignmentService = inject(AssignmentService);
  private groupService = inject(GroupService);
  private plantService = inject(PlantService);
  private userService = inject(User);
  
  assignments: IAssignment[] = [];
  displayDialog: boolean = false;
  assignmentForm!: FormGroup;
  loading = false;

  groups: IGroup[] = [];
  officers: any[] = [];
  speciesList: IPlant[] = [];

  ngOnInit() {
    this.initForm();
    this.loadDependencies();
    this.loadAssignments();
  }

  initForm() {
    this.assignmentForm = this.fb.group({
      groupId: ['', Validators.required],
      landArea: [null, [Validators.required, Validators.min(0.1)]], // in Hectares
      targetPlants: [null, [Validators.required, Validators.min(10)]],
      species: ['', Validators.required],
      assignedOfficer: ['', Validators.required]
    });
  }

  loadDependencies() {
    this.groupService.getGroups().subscribe(res => {
      this.groups = res?.data || res || [];
    });

    this.plantService.getPlants().subscribe(res => {
      this.speciesList = res?.data || res || [];
    });

    this.userService.getUsers({ limit: 100 }).subscribe(res => {
      const data = res?.data || res || {};
      this.officers = data.users || data || [];
    });
  }

  loadAssignments() {
    this.loading = true;
    this.assignmentService.getAssignments().subscribe({
      next: (res) => {
        this.assignments = (res?.data || res || []) as IAssignment[];
        this.loading = false;
      },
      error: () => {
        this.assignments = [];
        this.loading = false;
      }
    });
  }

  getGroupName(group: any): string {
    const resolved = typeof group === 'string' ? this.groups.find(g => g._id === group) : group;
    if (!resolved) return 'Unassigned group';
    return `${resolved.groupName || 'Group'}${resolved.village ? ' (' + resolved.village + ')' : ''}`;
  }

  getOfficerName(officer: any): string {
    const resolved = typeof officer === 'string' ? this.officers.find(o => o._id === officer) : officer;
    if (!resolved) return 'Unassigned officer';
    return `${resolved.firstName || ''} ${resolved.lastName || ''}`.trim() || resolved.email || 'Officer';
  }

  getAssignmentRef(assignment: IAssignment): string {
    return assignment._id ? assignment._id.slice(-8).toUpperCase() : 'NEW';
  }

  getSpeciesNames(species: any): string {
    return Array.isArray(species) ? species.join(', ') : species || '-';
  }

  showAssignDialog() {
    this.assignmentForm.reset();
    this.displayDialog = true;
  }

  hideAssignDialog() {
    this.displayDialog = false;
  }

  saveAssignment() {
    if (this.assignmentForm.valid) {
      const formValue = this.assignmentForm.value;
      const payload = {
        ...formValue,
        species: [formValue.species]
      };

      this.assignmentService.createAssignment(payload).subscribe({
        next: () => {
          this.hideAssignDialog();
          this.loadAssignments();
        }
      });
    }
  }
}
