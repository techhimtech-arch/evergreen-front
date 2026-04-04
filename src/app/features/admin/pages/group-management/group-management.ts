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

import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { GroupService, IGroup } from '../../../../core/services/group';

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
    InputNumberModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './group-management.html',
  styleUrls: ['./group-management.css']
})
export class GroupManagement implements OnInit {
  private fb = inject(FormBuilder);
  private groupService = inject(GroupService);
  private messageService = inject(MessageService);
  
  groups: IGroup[] = [];
  displayDialog: boolean = false;
  groupForm!: FormGroup;

  groupTypes = [
    { label: 'Mahila Mandal', value: 'Mahila Mandal' },
    { label: 'Yuvak Mandal', value: 'Yuvak Mandal' },
    { label: 'Self Help Group', value: 'Self Help Group' },
    { label: 'Other', value: 'Other' }
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
    this.loadGroups();
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
      membersCount: [10, [Validators.required, Validators.min(1)]]
    });
  }

  loadGroups() {
    this.groupService.getGroups().subscribe({
      next: (res: any) => {
        this.groups = res.data || [];
      },
      error: (err: any) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load groups' });
        console.error(err);
      }
    });
  }

  showCreateDialog() {
    this.groupForm.reset({ membersCount: 10 });
    this.displayDialog = true;
  }

  hideCreateDialog() {
    this.displayDialog = false;
  }

  saveGroup() {
    if (this.groupForm.valid) {
      const payload: IGroup = this.groupForm.value;
      this.groupService.createGroup(payload).subscribe({
        next: (res: any) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Group Created' });
          this.loadGroups();
          this.hideCreateDialog();
        },
        error: (err: any) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Failed to create group' });
        }
      });
    }
  }
}