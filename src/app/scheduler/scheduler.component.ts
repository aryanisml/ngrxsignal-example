// scheduler.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { RouterLink } from '@angular/router';

interface Event {
  id: number;
  title: string;
  start: Date;
  end: Date;
  type: 'critical' | 'check-track' | 'add-track';
  span?: number;
}

@Component({
  selector: 'app-scheduler',
  standalone: true,
  imports: [
    CommonModule, 
    ButtonModule, 
    DialogModule, 
    InputTextModule, 
    CalendarModule,
    FormsModule,
    DropdownModule,
    RouterLink
  ],
  template: `
    <div class="scheduler surface-card border-round shadow-1">
      <div class="scheduler-header p-3 border-bottom-1 surface-border">
        <div class="flex justify-content-between align-items-center">
          <h2 class="text-2xl font-bold m-0">Reservations</h2>
          <div class="flex align-items-center gap-4">
            <div class="flex gap-2">
              
            <button pButton 
                     [routerLink]="['/dhtmlxscheduler']"
                      label="DHTMLX Scheduler"
                      class="p-button-outlined">
              </button>
              <button pButton 
                      *ngFor="let action of actions" 
                      [label]="action.label"
                      [icon]="action.icon"
                      class="p-button-outlined">
              </button>
            </div>
            <div class="flex gap-2">
              <button pButton 
                      label="Calendar" 
                      icon="pi pi-calendar"
                      class="p-button-secondary">
              </button>
              <button pButton 
                      label="List View" 
                      icon="pi pi-list"
                      class="p-button-secondary"
                      [routerLink]="['/list']">
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="scheduler-table">
  <table class="w-full border-collapse">
    <thead>
      <tr>
        <th class="header-cell surface-ground"></th>
        <th *ngFor="let date of weekDates" class="header-cell surface-ground">
          <div class="font-medium">{{date | date:'EEE'}}</div>
          <div class="text-color-secondary">{{date | date:'MMM d'}}</div>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let time of timeSlots; let i = index">
        <td class="time-cell ">{{time}}</td>
        <td *ngFor="let date of weekDates" 
            class="grid-cell relative"
            [class.surface-ground]="i % 2 === 0"
            [style.height.px]="getEventsForTimeSlot(date, time).length * 32 + 30 < 60 ? 60 : getEventsForTimeSlot(date, time).length * 32 + 30"
            (click)="openNewEventDialog(date, time)">
          <ng-container *ngFor="let event of getEventsForTimeSlot(date, time); let eventIndex = index">
            <div [class]="'event ' + event.type"
                 [style.top]="eventIndex * 32 + 'px'"
                 [style.height]="30 + 'px'"
                 [style.width]="getEventWidth(event)"
                 [style.zIndex]="event.span ? 2 : 1"
                 (click)="openEditEventDialog(event, $event)">
              <span class="event-icon">{{getEventIcon(event.type)}}</span>
              <span class="event-title">{{event.title}}</span>
              <span *ngIf="isMultiDayEvent(event)" class="event-duration">
                {{formatEventDuration(event)}}
              </span>
            </div>
          </ng-container>
        </td>
      </tr>
    </tbody>
  </table>
</div>

    </div>

    <!-- Event Dialog -->
    <p-dialog [(visible)]="showEventDialog" 
              [header]="editingEvent ? 'Edit Event' : 'New Event'"
              [modal]="true" 
              [style]="{width: '450px'}"
              (onHide)="resetDialog()">
      <div class="flex flex-column gap-3">
        <div class="field">
          <label for="title" class="block mb-2">Title</label>
          <input id="title" 
                 type="text" 
                 pInputText 
                 [(ngModel)]="newEvent.title" 
                 class="w-full">
        </div>

        <div class="field">
          <label class="block mb-2">Event Type</label>
          <p-dropdown [options]="eventTypes" 
                     [(ngModel)]="newEvent.type"
                     optionLabel="label" 
                     optionValue="value"
                     class="w-full">
          </p-dropdown>
        </div>

        <div class="field">
          <label class="block mb-2">Start Date & Time</label>
          <p-calendar [(ngModel)]="newEvent.start" 
                     [showTime]="true" 
                     hourFormat="24"
                     [showIcon]="true"
                     class="w-full">
          </p-calendar>
        </div>

        <div class="field">
          <label class="block mb-2">End Date & Time</label>
          <p-calendar [(ngModel)]="newEvent.end" 
                     [showTime]="true" 
                     hourFormat="24"
                     [showIcon]="true"
                     class="w-full">
          </p-calendar>
        </div>
      </div>

      <ng-template pTemplate="footer">
        <div class="flex justify-content-end gap-2">
          <button pButton 
                  label="Cancel" 
                  class="p-button-text" 
                  (click)="showEventDialog = false">
          </button>
          <button pButton 
                  label="Save" 
                  (click)="saveEvent()">
          </button>
          <button *ngIf="editingEvent" 
                  pButton 
                  label="Delete" 
                  class="p-button-danger" 
                  (click)="deleteEvent()">
          </button>
        </div>
      </ng-template>
    </p-dialog>
  `,
  styles: [`
 .grid-cell {
  min-height: 60px;
  border: 1px solid #e5e7eb;
  padding: 0.25rem;
  position: relative;
}

.time-cell {
  min-width: 30px;
  height: 60px !important;
  font-weight: 500;
  color: #4b5563;
  border: 1px solid rgba(229, 231, 235, 0.5);
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  margin: 4px;
  font-size: 0.875rem;
  text-align: center;
    border-color: black;
    justify-content: center;

}

.header-cell {
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
}

.event {
  position: absolute;
  left: 4px;
  right: 4px;
  padding: 0.5rem;
  border-radius: 6px;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  height: 36px;
  z-index: 1;
}

.event.critical {
  background: #fee2e2;
  border: 1px solid #ef4444;
}

.event.check-track {
  background: #fff;
  border: 1px dashed #22c55e;
}

.event.add-track {
  background: #fff;
  border: 1px solid #3b82f6;
}

table {
  border-collapse: collapse;
  width: 100%;
}

  `]
})
export class SchedulerComponent implements OnInit {
  timeSlots: string[] = [];
  weekDates: Date[] = [];
  events: Event[] = [];
  showEventDialog = false;
  editingEvent: Event | null = null;
  newEvent: any = {};

  actions = [
    { icon: '⚠️', label: 'Critical' },
    { icon: '✓', label: 'Check Track' },
    { icon: '+', label: 'Add Track' },
    { icon: '🔒', label: 'Reserved' }
  ];

  eventTypes = [
    { label: 'Critical', value: 'critical' },
    { label: 'Check Track', value: 'check-track' },
    { label: 'Add Track', value: 'add-track' }
  ];

  navigate(){

  }

  ngOnInit() {
    this.generateTimeSlots();
    this.generateWeekDates();
    this.generateMockEvents();
  }

  generateTimeSlots() {
    for (let i = 8; i <= 18; i++) {
      this.timeSlots.push(`${i.toString().padStart(2, '0')}:00`);
    }
  }

  generateWeekDates() {
    const startDate = new Date(2024, 1, 3);
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      this.weekDates.push(date);
    }
  }

  generateMockEvents() {
    this.events = [
      {
        id: 1,
        title: 'Check Track',
        start: new Date(2024, 1, 3, 8),
        end: new Date(2024, 1, 6, 9),
        type: 'check-track',
        span: 4
      },
      {
        id: 2,
        title: 'Critical Task',
        start: new Date(2024, 1, 3, 9),
        end: new Date(2024, 1, 3, 10),
        type: 'critical'
      },
      {
        id: 3,
        title: 'Add Track',
        start: new Date(2024, 1, 4, 9),
        end: new Date(2024, 1, 5, 10),
        type: 'add-track',
        span: 2
      }
    ];
  }
  // getEventsForTimeSlot(date: Date, time: string): Event[] {
  //   const hour = parseInt(time.split(':')[0]);
  //   const slotStart = new Date(date);
  //   slotStart.setHours(hour, 0, 0, 0);
  //   const slotEnd = new Date(slotStart);
  //   slotEnd.setHours(hour + 1, 0, 0, 0);
    
  //   return this.events.filter(event => {
  //     const eventStart = new Date(event.start);
  //     const eventEnd = new Date(event.end);
  //     return eventStart < slotEnd && eventEnd > slotStart;
  //   });
  // }
  
  // Add method to calculate vertical position
  getEventTop(event: Event, existingEvents: Event[]): string {
    // const index = existingEvents.findIndex(e => e.id === event.id);
    // return `${index * 30}px`;

    const index = existingEvents.findIndex(e => e.id === event.id);
  const top = index * 35; // Increased spacing between events
  return `${top}px`;

  }

  
  getEventsForTimeSlot(date: Date, time: string): Event[] {
    const hour = parseInt(time.split(':')[0]);
    const slotStart = new Date(date);
    slotStart.setHours(hour, 0, 0, 0);
    
    return this.events.filter(event => {
      const eventStart = new Date(event.start);
      eventStart.setSeconds(0, 0);
      
      // Check if the event starts at this exact time slot
      return (
        eventStart.getFullYear() === slotStart.getFullYear() &&
        eventStart.getMonth() === slotStart.getMonth() &&
        eventStart.getDate() === slotStart.getDate() &&
        eventStart.getHours() === slotStart.getHours()
      );
    });
  }
  
  getEventWidth(event: Event): string {
    if (event.span) {
      return `calc(${event.span * 100}% - 4px)`;
    }
    return 'calc(100% - 4px)';
  }
  
  getEventHeight(event: Event): string {
    document.querySelectorAll('tr').forEach(tr => {
      const td = tr.querySelector('td'); // Assuming you want to match the first td in each tr
      if (td) {
        tr.style.height = `${td.offsetHeight}px`;
      }
    });

    if (event.span) {
      return `${30}px`;
    }
    const hours = (event.end.getTime() - event.start.getTime()) / (1000 * 60 * 60);
   // return `${Math.max(56, hours * 60)}px`;
   return `${30}px`;
  }

  calculateEventOffset(event: Event): number {
    const existingEvents = this.events.filter(e => 
      e.start.getTime() < event.start.getTime() &&
      e.end.getTime() > event.start.getTime()
    );
    return existingEvents.length * 30;
  }


  getEventIcon(type: string): string {
    switch(type) {
      case 'critical': return '⚠️';
      case 'check-track': return '✓';
      case 'add-track': return '+';
      default: return '';
    }
  }

  openNewEventDialog(date: Date, time: string) {
    const startDate = new Date(date);
    startDate.setHours(parseInt(time));
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 1);

    this.editingEvent = null;
    this.newEvent = {
      title: '',
      type: 'add-track',
      start: startDate,
      end: endDate
    };
    this.showEventDialog = true;
  }

  openEditEventDialog(event: Event, e: MouseEvent) {
    e.stopPropagation();
    this.editingEvent = event;
    this.newEvent = { ...event };
    this.showEventDialog = true;
  }

  saveEvent() {
    const startDate = new Date(this.newEvent.start);
    const endDate = new Date(this.newEvent.end);
    
    const daysDiff = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / 
      (1000 * 60 * 60 * 24)
    );
    
    const newEventData = {
      ...this.newEvent,
      span: daysDiff > 1 ? daysDiff : undefined
    };

    if (this.editingEvent) {
      const index = this.events.findIndex(e => e.id === this.editingEvent!.id);
      if (index !== -1) {
        this.events[index] = { ...newEventData, id: this.editingEvent.id };
      }
    } else {
      this.events.push({
        ...newEventData,
        id: this.events.length + 1
      });
    }
    
    this.resetDialog();
  }

  deleteEvent() {
    if (this.editingEvent) {
      this.events = this.events.filter(e => e.id !== this.editingEvent!.id);
      this.resetDialog();
    }
  }

  resetDialog() {
    this.showEventDialog = false;
    this.editingEvent = null;
    this.newEvent = {};
  }

  isMultiDayEvent(event: Event): boolean {
    return !!event.span && event.span > 1;
  }

  formatEventDuration(event: Event): string {
    if (!event.span || event.span <= 1) return '';
    return `${event.span} days`;
  }

  
}