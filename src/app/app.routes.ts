import { Routes } from '@angular/router';

export const routes: Routes = [
    {
      path: 'scheduler',
      loadComponent: () => import('./scheduler/scheduler.component')
        .then(m => m.SchedulerComponent)
    },
    {
        path: 'dhtmlxscheduler',
        loadComponent: () => import('./dhtml-scheduler/dhtml-scheduler.component')
          .then(m => m.DhtmlSchedulerComponent)
      },
      { path: '', redirectTo: '/scheduler', pathMatch: 'full' }
    // Same for other routes
  ];