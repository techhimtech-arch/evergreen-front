import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormsModule } from '@angular/forms';
import { EventService, IPlantationEvent } from '../../../../core/services/event';
import { User } from '../../../../core/services/user';

@Component({
  selector: 'app-event-management',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputTextareaModule,
    CalendarModule,
    DropdownModule,
    ToastModule,
    TagModule,
    ConfirmDialogModule,
    FormsModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './event-management.html',
  styleUrl: './event-management.css',
})
export class EventManagement implements OnInit {
  private eventService = inject(EventService);
  private userService = inject(User);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  events: IPlantationEvent[] = [];
  users: any[] = [];
  loading = false;
  displayDialog = false;
  isEditing = false;

  eventForm: Partial<IPlantationEvent> = {
    eventName: '',
    description: '',
    eventDate: '',
    location: '',
    organizerId: '',
    targetPlants: 0,
    status: 'PLANNED'
  };

  statusOptions = [
    { label: 'Planned', value: 'PLANNED' },
    { label: 'Ongoing', value: 'ONGOING' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Cancelled', value: 'CANCELLED' }
  ];

  ngOnInit() {
    this.loadEvents();
    this.loadUsers();
  }

  loadEvents() {
    this.loading = true;
    this.eventService.getEvents().subscribe({
      next: (res) => {
        this.events = res?.data || res || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching events', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load events'
        });
        this.loading = false;
      }
    });
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (res) => {
        this.users = res?.data || res || [];
      },
      error: (err) => {
        console.error('Error fetching users', err);
      }
    });
  }

  openNewEventDialog() {
    this.isEditing = false;
    this.eventForm = {
      eventName: '',
      description: '',
      eventDate: '',
      location: '',
      organizerId: '',
      targetPlants: 0,
      status: 'PLANNED'
    };
    this.displayDialog = true;
  }

  editEvent(event: IPlantationEvent) {
    this.isEditing = true;
    this.eventForm = { ...event };
    this.displayDialog = true;
  }

  saveEvent() {
    if (this.isEditing && this.eventForm._id) {
      this.eventService.updateEvent(this.eventForm._id, this.eventForm).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Event updated successfully'
          });
          this.displayDialog = false;
          this.loadEvents();
        },
        error: (err) => {
          console.error('Error updating event', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update event'
          });
        }
      });
    } else {
      this.eventService.createEvent(this.eventForm as IPlantationEvent).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Event created successfully'
          });
          this.displayDialog = false;
          this.loadEvents();
        },
        error: (err) => {
          console.error('Error creating event', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create event'
          });
        }
      });
    }
  }

  deleteEvent(event: IPlantationEvent) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the event "${event.eventName}"?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (event._id) {
          this.eventService.deleteEvent(event._id).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Event deleted successfully'
              });
              this.loadEvents();
            },
            error: (err) => {
              console.error('Error deleting event', err);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete event'
              });
            }
          });
        }
      }
    });
  }

  getOrganizerName(organizerId: string): string {
    const user = this.users.find(u => u._id === organizerId || u.id === organizerId);
    return user ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Unknown';
  }

  getStatusSeverity(status: string): string {
    switch (status) {
      case 'PLANNED': return 'info';
      case 'ONGOING': return 'warning';
      case 'COMPLETED': return 'success';
      case 'CANCELLED': return 'danger';
      default: return 'info';
    }
  }
}