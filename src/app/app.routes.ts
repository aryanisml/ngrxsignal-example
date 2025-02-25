import { Routes } from '@angular/router';

export const routes: Routes = [
    {
      path: 'scheduler',
      loadComponent: () => import('./scheduler/scheduler.component')
        .then(m => m.SchedulerComponent)
    },
    {
      path: 'list',
      loadComponent: () => import('./list/list.component')
        .then(m => m.ListComponent)
    },
    {
        path: 'dhtmlxscheduler',
        loadComponent: () => import('./dhtml-scheduler/dhtml-scheduler.component')
          .then(m => m.DhtmlSchedulerComponent)
      },
      {
        path: 'res',
        loadComponent: () => import('./reservation/reservation.component')
          .then(m => m.ReservationTimelineComponent)
      },
      { path: '', redirectTo: '/scheduler', pathMatch: 'full' }
    // Same for other routes
  ];