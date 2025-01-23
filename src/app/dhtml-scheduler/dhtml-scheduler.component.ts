import { Component,AfterViewInit } from '@angular/core';
import "dhtmlx-scheduler";
declare const scheduler: any;

@Component({
  selector: 'app-dhtml-scheduler',
 template: `<div id="scheduler_here" style="width: 100%; height: 600px;"></div>`,
  styleUrl: './dhtml-scheduler.component.scss'
})
export class DhtmlSchedulerComponent  implements AfterViewInit{

constructor(){
scheduler.config.first_hour = 6;  // Start timeline from 6 AM
scheduler.config.last_hour = 20;  // End timeline at 8 PM
scheduler.config.multi_day = true;  // Disable default multi-day view
scheduler.config.separate_short_events = true;  // Place events in time slots
scheduler.config.fix_tab_position = false;  // Allow events in correct time positions
scheduler.config.details_on_create = true;

// Add event with specific time
scheduler.addEvent({
    start_date: new Date(2025, 0, 20, 9, 0), 
    end_date: new Date(2025, 0, 22, 9, 0),   
    text: "Sample Event"
});

  }
  ngAfterViewInit(): void {
    scheduler.init('scheduler_here', new Date(), 'week'); // Initialize Scheduler
    scheduler.parse([
      { id: 1, text: 'Critical', start_date: '2025-02-22 08:00', end_date: '2025-02-22 10:00' },
      { id: 2, text: 'Add Truck', start_date: '2025-02-23 11:00', end_date: '2025-02-23 12:00' }
    ], 'json'); // Example events
  }
}
