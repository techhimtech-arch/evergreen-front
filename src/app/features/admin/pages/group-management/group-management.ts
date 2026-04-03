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

export interface GroupModel {
  id: string;
  groupName: string;
  groupType: string;
  village: string;
  panchayat: string;
  district: string;
  leaderName: string;
  mobile: string;
  membersCount: number;
  status: string;
}

@Component({
  selector: 'app-group-management',
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
  templateUrl: './group-management.html',
  styleUrls: ['./group-management.css']
})
export class GroupManagement implements OnInit {
  private fb = inject(FormBuilder);
  
  groups: GroupModel[] = [];
  displayDialog: boolean = false;
  groupForm!: FormGroup;

  groupTypes = [
    { label: 'Mahila Mandal', value: 'Mahila Mandal' },
    { label: 'Yuvak Mandal', value: 'Yuvak Mandal' },
    { label: 'SHG (Self Help Group)', value: 'SHG' }
  ];

  districts = [
    { label: 'Shimla', value: 'Shimla' },
    { label: 'Kangra', value: 'Kangra' },
    { label: 'Kullu', value: 'Kullu' },
    { label: 'Mandi', value: 'Mandi' },
    { label: 'Solan', value: 'Solan' }
  ];

  ngOnInit() {
    this.initForm();
    this.loadMockData();
  }

  initForm() {
    this.groupForm = this.fb.group({
      groupName: ['', Validators.required],
      groupType: ['', Validators.required],
      village: ['', Validators.required],
      panchayat: ['', Validators.required],
      district: ['', Validators.required],
      leaderName: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      membersCount: [10, [Validators.required, Validators.min(1)]],
      status: ['Active']
    });
  }

  loadMockData() {
    this.groups = [
      {
        id: '1', groupName: 'Saraswati Mahila Mandal', groupType: 'Mahila Mandal',
        village: 'Rampur', panchayat: 'Rampur', district: 'Shimla',
        leaderName: 'Pooja Devi', mobile: '9876543210', membersCount: 15, status: 'Active'
      },
      {
        id: '2', groupName: 'Kullu Yuvak Mandal', groupType: 'Yuvak Mandal',
        village: 'Bhuntar', panchayat: 'Bhuntar', district: 'Kullu',
        leaderName: 'Amit Sharma', mobile: '9988776655', membersCount: 22, status: 'Active'
      },
      {
        id: '3', groupName: 'Nari Shakti SHG', groupType: 'SHG',
        village: 'Palampur', panchayat: 'Palampur', district: 'Kangra',
        leaderName: 'Sunita Thakur', mobile: '9123456789', membersCount: 12, status: 'Active'
      }
    ];
  }

  showCreateDialog() {
    this.groupForm.reset({ membersCount: 10, status: 'Active' });
    this.displayDialog = true;
  }

  hideCreateDialog() {
    this.displayDialog = false;
  }

  saveGroup() {
    if (this.groupForm.valid) {
      const newGroup: GroupModel = {
        id: Math.random().toString(36).substr(2, 9),
        ...this.groupForm.value
      };
      
      this.groups = [...this.groups, newGroup];
      this.hideCreateDialog();
    }
  }
}