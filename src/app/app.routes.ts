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
      path: 'split',
      loadComponent: () => import('./split/split.component')
        .then(m => m.SplitComponent)
    },
    {
      path: 'dateselector',
      loadComponent: () => import('./date-selector/date-selector.component')
        .then(m => m.DateSelectorComponent)
    },
    {
      path: 'res',
      loadComponent: () => import('./consumer-accordin/consumer-accordin.component')
        .then(m => m.ConsumerAccordinComponent)
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
      {
        path: 'cards',
        loadComponent: () => import('./reservation-cards-sample/reservation-cards-sample.component')
          .then(m => m.ReservationCardsSampleComponent)
      },
      { path: '', redirectTo: '/scheduler', pathMatch: 'full' }
    // Same for other routes
  ];