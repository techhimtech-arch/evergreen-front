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
    InputNumberModule
  ],
  templateUrl: './plantation-assignment.html',
  styleUrls: ['./plantation-assignment.css']
})
export class PlantationAssignment implements OnInit {
  private fb = inject(FormBuilder);
  
  assignments: AssignmentModel[] = [];
  displayDialog: boolean = false;
  assignmentForm!: FormGroup;

  groups = [
    { label: 'Saraswati Mahila Mandal (Shimla)', value: 'G-001' },
    { label: 'Kullu Yuvak Mandal (Kullu)', value: 'G-002' },
    { label: 'Nari Shakti SHG (Kangra)', value: 'G-003' }
  ];

  officers = [
    { label: 'Rajinder Singh (DFO)', value: 'USR-O-101' },
    { label: 'Suresh Thakur (RO)', value: 'USR-O-102' }
  ];

  speciesList = [
    { label: 'Deodar (Cedrus deodara)', value: 'Deodar' },
    { label: 'Kail (Pinus wallichiana)', value: 'Kail' },
    { label: 'Ban Oak (Quercus leucotrichophora)', value: 'Ban Oak' },
    { label: 'Chir Pine (Pinus roxburghii)', value: 'Chir Pine' }
  ];

  ngOnInit() {
    this.initForm();
    this.loadMockData();
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

  loadMockData() {
    this.assignments = [
      {
        id: 'A-101',
        landArea: 1.5,
        targetPlants: 1200,
        species: 'Deodar',
        groupId: 'G-001',
        assignedOfficer: 'USR-O-101',
        assignedDate: new Date('2024-05-10'),
        status: 'In Progress'
      },
      {
        id: 'A-102',
        landArea: 2.0,
        targetPlants: 2000,
        species: 'Kail',
        groupId: 'G-002',
        assignedOfficer: 'USR-O-102',
        assignedDate: new Date('2024-05-12'),
        status: 'Pending'
      }
    ];
  }

  getGroupName(id: string): string {
    return this.groups.find(g => g.value === id)?.label || id;
  }

  getOfficerName(id: string): string {
    return this.officers.find(o => o.value === id)?.label || id;
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
      const newAssignment: AssignmentModel = {
        id: 'A-' + Math.floor(Math.random() * 1000),
        assignedDate: new Date(),
        status: 'Pending',
        ...formValue
      };
      
      this.assignments = [...this.assignments, newAssignment];
      this.hideAssignDialog();
    }
  }
}