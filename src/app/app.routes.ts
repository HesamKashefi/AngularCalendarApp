import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'calendar',
        loadComponent: () => import('./components/calendar/calendar.component').then(x => x.CalendarComponent)
    },
    {
        path: '**',
        redirectTo: 'calendar'
    }
];
