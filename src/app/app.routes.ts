import { Routes } from '@angular/router';
import { makeSureDateIsValidGuard } from './guards/make-sure-date-is-valid-guard';

export const routes: Routes = [
    {
        path: 'calendar',
        loadComponent: () => import('./components/calendar/calendar.component').then(x => x.CalendarComponent)
    },
    {
        path: 'day/:date',
        canActivate: [makeSureDateIsValidGuard],
        loadComponent: () => import('./components/calendar/day-view/day-view.component').then(x => x.DayViewComponent)
    },
    {
        path: '**',
        redirectTo: 'calendar'
    }
];
