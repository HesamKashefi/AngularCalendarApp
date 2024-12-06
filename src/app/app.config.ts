import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { appReducer as appointmentsReducer } from './store/reducers/appointments.reducer';
import { CalendarEffect } from './store/effects/calendar.effect';
import { hydrationMetaReducer } from './store/reducers/hydration.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withRouterConfig({ paramsInheritanceStrategy: 'always' })),
    provideAnimationsAsync(),
    provideStore({ appointments: appointmentsReducer }, { metaReducers: [hydrationMetaReducer] }),
    provideEffects([CalendarEffect])
  ]
};
