import { Component, OnInit, signal, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface TimeSlot {
  time: string;
  events: ReservationEvent[];
}

interface ReservationEvent {
  id: number;
  start: Date;
  end: Date;
  status: 'critical' | 'check' | 'reserved' | 'pending';
  title: string;
}

@Component({
  selector: 'app-reservation-timeline',
  standalone: true,
  imports: [
    CommonModule, 
    TableModule, 
    ButtonModule, 
    DialogModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="reservation-container p-4">
      <div class="header-actions flex justify-content-between align-items-center mb-4">
        <h2 class="text-xl">Reservations</h2>
        <div class="action-buttons">
          <button pButton class="p-button-danger mr-2" icon="pi pi-exclamation-triangle" label="Critical"></button>
          <button pButton class="p-button-secondary mr-2" icon="pi pi-check" label="Check Track"></button>
          <button pButton class="p-button-success mr-2" icon="pi pi-plus" label="Add Track" (click)="openAddDialog()"></button>
          <button pButton class="p-button-info" icon="pi pi-bookmark" label="Reserved"></button>
        </div>
      </div>

      <div class="timeline-grid">
        <p-table [value]="timeSlots()" styleClass="timeline-table">
          <ng-template pTemplate="header">
            <tr>
              <th class="time-header">Time</th>
              @for (date of dates(); track date) {
                <th>{{ date | date:'EEE, MMM d' }}</th>
              }
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-slot>
            <tr [ngStyle]="getRowStyle(slot)">
              <td class="time-cell">{{ slot.time }}</td>
              @for (date of dates(); track date; let colIndex = $index) {
                @if (shouldRenderCell(slot.time, date, colIndex)) {
                  <td [attr.colspan]="getMaxColspan(slot.time, date)">
                    <div class="events-container" [ngStyle]="getEventsContainerStyle(slot.time, date)">
                      @for (event of getEventsForTimeSlot(slot.time, date); track event.id; let i = $index) {
                        <div [ngClass]="['event-item', event.status]"
                             [ngStyle]="getEventStyle(event, i, getEventsForTimeSlot(slot.time, date).length)"
                             (click)="openEditDialog(event)">
                          <i class="pi mr-2" [ngClass]="getEventIcon(event.status)"></i>
                          {{ event.title }}
                        </div>
                      }
                    </div>
                  </td>
                }
              }
            </tr>
          </ng-template>
        </p-table>
      </div>

      <p-dialog 
        [header]="isEditMode() ? 'Edit Event' : 'Add Event'" 
       [visible]="dialogVisible()" 
(visibleChange)="dialogVisible.set($event)"
        [modal]="true" 
        [style]="{ width: '450px' }"
        (onHide)="hideDialog()">
        @if (eventForm) {
          <form [formGroup]="eventForm" class="p-fluid">
            <div class="field mb-4">
              <label for="title">Title</label>
              <input id="title" type="text" pInputText formControlName="title">
            </div>

            <div class="field mb-4">
              <label for="status">Status</label>
              <p-dropdown id="status" 
                         [options]="statusOptions" 
                         formControlName="status" 
                         optionLabel="label" 
                         optionValue="value">
              </p-dropdown>
            </div>

            <div class="field mb-4">
              <label>Start Date & Time</label>
              <p-calendar formControlName="startDate" 
                         [showTime]="true" 
                         [style]="{ width: '100%' }">
              </p-calendar>
            </div>

            <div class="field mb-4">
              <label>End Date & Time</label>
              <p-calendar formControlName="endDate" 
                         [showTime]="true" 
                         [style]="{ width: '100%' }">
              </p-calendar>
            </div>
          </form>
        }

        <ng-template pTemplate="footer">
          <button pButton label="Cancel" 
                  icon="pi pi-times" 
                  class="p-button-text" 
                  (click)="hideDialog()">
          </button>
          @if (isEditMode()) {
            <button pButton label="Delete" 
                    icon="pi pi-trash" 
                    class="p-button-danger mr-2" 
                    (click)="deleteEvent()">
            </button>
          }
          <button pButton [label]="isEditMode() ? 'Update' : 'Save'" 
                  icon="pi pi-check" 
                  (click)="saveEvent()">
          </button>
        </ng-template>
      </p-dialog>
    </div>
  `,
  styles: [`
    .reservation-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .timeline-grid {
      overflow-x: auto;
    }

    .timeline-table {
      border-collapse: collapse;
      width: 100%;
    }

    .time-header, .time-cell {
      width: 100px;
      padding: 8px;
      border-right: 1px solid #e0e0e0;
    }

    td {
      border: 1px solid #e0e0e0;
      position: relative;
      padding: 0;
    }

    .events-container {
      position: relative;
      width: 100%;
      height: 100%;
    }

    .event-item {
      position: absolute;
      padding: 8px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      font-size: 0.9rem;
      z-index: 1;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .critical {
      background-color: #fee2e2;
      border: 1px solid #ef4444;
      color: #991b1b;
    }

    .check {
      background-color: #dcfce7;
      border: 1px solid #22c55e;
      color: #166534;
    }

    .reserved {
      background-color: #dbeafe;
      border: 1px solid #3b82f6;
      color: #1e40af;
    }
  `]
})
export class ReservationTimelineComponent implements OnInit {
  timeSlots = signal<TimeSlot[]>([]);
  dates = signal<Date[]>([]);
  events = signal<ReservationEvent[]>([]);
  selectedEvent = signal<ReservationEvent | null>(null);
  dialogVisible = signal(false);
  isEditMode = signal(false);
  eventForm: FormGroup | any;
  baseRowHeight = 60;

  statusOptions = [
    { label: 'Critical', value: 'critical' },
    { label: 'Check Track', value: 'check' },
    { label: 'Reserved', value: 'reserved' }
  ];

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  private initForm() {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      status: ['', Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.initializeDates();
    this.initializeTimeSlots();
    this.loadSampleEvents();
  }

  initializeDates() {
    const startDate = new Date(2024, 1, 3);
    const dateArray: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dateArray.push(date);
    }
    this.dates.set(dateArray);
  }

  initializeTimeSlots() {
    const slots: TimeSlot[] = [];
    for (let hour = 8; hour <= 17; hour++) {
      slots.push({
        time: `${hour.toString().padStart(2, '0')}:00`,
        events: []
      });
    }
    this.timeSlots.set(slots);
  }

  loadSampleEvents() {
    const sampleEvents: ReservationEvent[] = [
      {
        id: 1,
        start: new Date(2024, 1, 3, 8, 0),
        end: new Date(2024, 1, 5, 9, 0),
        status: 'check',
        title: 'Check Track'
      },
      {
        id: 2,
        start: new Date(2024, 1, 3, 9, 0),
        end: new Date(2024, 1, 3, 10, 0),
        status: 'critical',
        title: 'Critical Event 1'
      },
      {
        id: 3,
        start: new Date(2024, 1, 3, 9, 0),
        end: new Date(2024, 1, 3, 10, 0),
        status: 'reserved',
        title: 'Reserved Event'
      }
    ];
    this.events.set(sampleEvents);
  }

  getEventsForTimeSlot(time: string, date: Date): ReservationEvent[] {
    const hour = parseInt(time.split(':')[0]);
    return this.events().filter(event => {
      const eventStartDate = event.start.getDate();
      const eventEndDate = event.end.getDate();
      const currentDate = date.getDate();
      const eventStartHour = event.start.getHours();
      
      return currentDate >= eventStartDate && 
             currentDate <= eventEndDate && 
             eventStartHour === hour;
    });
  }

  shouldRenderCell(time: string, date: Date, colIndex: number): boolean {
    const events = this.getEventsForTimeSlot(time, date);
    if (events.length === 0) return true;

    return events.some(event => {
      const eventStartDate = event.start.getDate();
      return date.getDate() === eventStartDate;
    });
  }

  getMaxColspan(time: string, date: Date): number {
    const events = this.getEventsForTimeSlot(time, date);
    if (events.length === 0) return 1;

    return Math.max(...events.map(event => {
      const startDate = event.start.getDate();
      const endDate = event.end.getDate();
      return endDate - startDate + 1;
    }));
  }

  getRowStyle(slot: TimeSlot): any {
    const maxEvents = Math.max(...this.dates().map(date => 
      this.getEventsForTimeSlot(slot.time, date).length
    ));
    
    const height = Math.max(this.baseRowHeight, maxEvents * 40);
    return { height: `${height}px` };
  }

  getEventsContainerStyle(time: string, date: Date): any {
    const events = this.getEventsForTimeSlot(time, date);
    const height = Math.max(this.baseRowHeight, events.length * 40);
    return { height: `${height}px` };
  }

  getEventStyle(event: ReservationEvent, index: number, totalEvents: number): any {
    const colspan = event.end.getDate() - event.start.getDate() + 1;
    const top = index * 40 + 4;
    
    return {
      width: `calc(${colspan * 100}% - 8px)`,
      top: `${top}px`,
      left: '4px',
      height: '36px'
    };
  }

  getEventIcon(status: string): string {
    const icons = {
      critical: 'pi-exclamation-triangle',
      check: 'pi-check',
      reserved: 'pi-bookmark',
      pending: 'pi-clock'
    };
    return 'pi-clock';
  }

  openAddDialog() {
    this.isEditMode.set(false);
    this.selectedEvent.set(null);
    this.eventForm.reset();
    this.dialogVisible.set(true);
  }

  openEditDialog(event: ReservationEvent) {
    this.isEditMode.set(true);
    this.selectedEvent.set(event);
    this.eventForm.patchValue({
      title: event.title,
      status: event.status,
      startDate: event.start,
      endDate: event.end
    });
    this.dialogVisible.set(true);
  }

  hideDialog() {
    this.dialogVisible.set(false);
    this.eventForm.reset();
    this.selectedEvent.set(null);
  }

  saveEvent() {
    if (this.eventForm.valid) {
      const formValue = this.eventForm.value;
      const eventData: ReservationEvent = {
        id: this.selectedEvent()?.id || Math.floor(Math.random() * 1000),
        title: formValue.title,
        status: formValue.status,
        start: formValue.startDate,
        end: formValue.endDate
      };

      const currentEvents = this.events();
      const eventIndex = currentEvents.findIndex(e => e.id === eventData.id);
      
      if (eventIndex > -1) {
        currentEvents[eventIndex] = eventData;
      } else {
        currentEvents.push(eventData);
      }
      
      this.events.set([...currentEvents]);
      this.hideDialog();
    }
  }

  deleteEvent() {
    const eventId = this.selectedEvent()?.id;
    if (eventId) {
      this.events.set(this.events().filter(e => e.id !== eventId));
      this.hideDialog();
    }
  }
}