import { Component } from '@angular/core';
import { UserFormComponent } from './user-form/user-form.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core'; //
import dayGridPlugin from '@fullcalendar/daygrid'; 
import timeGridPlugin from '@fullcalendar/timegrid'; // Import timeGridPlugin
import interactionPlugin from '@fullcalendar/interaction'; // Import interactionPlugin

@Component({

    selector: 'app-root',
    standalone: true,
    imports: [ 
         SchedulerComponent,
        FullCalendarModule
    ],
    template: `
        <div class="container mx-auto p-4">
            <!-- <h1 class="text-2xl font-bold mb-4">User Management</h1> -->
            <app-scheduler />
            <!-- <full-calendar [options]="calendarOptions"></full-calendar> -->
        </div>
    `
})
export class AppComponent {
    // calendarOptions: CalendarOptions = {
    //     initialView: 'dayGridMonth',
    //     weekends: false // initial value
    //   };
    
    //   toggleWeekends() {
    //     this.calendarOptions.weekends = !this.calendarOptions.weekends // toggle the boolean!
    //   }
    /*
    calendarOptions: CalendarOptions = {
        initialView: 'timeGridWeek',
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        slotDuration: '01:00:00',
        slotLabelInterval: '01:00:00',
        plugins: [ dayGridPlugin, timeGridPlugin, interactionPlugin ], // Add plugins here,
        slotMinTime: '08:00:00', // Start time at 8:00 AM
slotMaxTime: '18:00:00', // End time at 6:00 PM,
height: 'auto',
events: [
    {
      title: 'Check Track',
      start: '2025-02-03T08:00:00',
      end: '2025-02-03T09:00:00',
      className: 'event-check-track',
    },
    {
      title: 'Add Track',
      start: '2025-02-04T09:00:00',
      end: '2025-02-04T10:00:00',
      className: 'event-add-track',
    },
    {
      title: 'Critical',
      start: '2025-02-05T10:00:00',
      end: '2025-02-05T11:00:00',
      className: 'event-critical',
    },
    {
      title: 'Reserved',
      start: '2025-02-06T11:00:00',
      end: '2025-02-06T12:00:00',
      className: 'event-reserved',
    },
  ],
  editable: true,
  droppable: true,
  eventClick: this.handleEventClick.bind(this),
      }; 
      
      handleEventClick(arg: any) {
        alert(`Event clicked: ${arg.event.title}`);
      }
        */
    }