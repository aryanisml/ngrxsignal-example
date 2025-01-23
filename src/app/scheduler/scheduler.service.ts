import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SchedulerService {
  getEvents() {
    return [
      {
        id: 1,
        title: 'Critical Task',
        start: new Date(2024, 1, 3, 9),
        end: new Date(2024, 1, 3, 10),
        type: 'critical'
      },
      {
        id: 2,
        title: 'Check Track',
        start: new Date(2024, 1, 3, 8),
        end: new Date(2024, 1, 3, 9),
        type: 'check-track'
      }
    ];
  }
}