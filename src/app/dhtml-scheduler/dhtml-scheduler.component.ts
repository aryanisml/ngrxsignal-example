import { Component,AfterViewInit } from '@angular/core';
import "dhtmlx-scheduler";
declare const scheduler: any;

@Component({
  selector: 'app-dhtml-scheduler',
 template: `<div id="scheduler_here" style="width: 100%; height: 600px;"></div>`,
  styleUrl: './dhtml-scheduler.component.scss'
})
export class DhtmlSchedulerComponent  implements AfterViewInit{
  ngAfterViewInit(): void {
    scheduler.init('scheduler_here', new Date(), 'week'); // Initialize Scheduler
    scheduler.parse([
      { id: 1, text: 'Critical', start_date: '2025-02-03 08:00', end_date: '2025-02-03 10:00' },
      { id: 2, text: 'Add Truck', start_date: '2025-02-03 11:00', end_date: '2025-02-03 12:00' }
    ], 'json'); // Example events
  }
}
