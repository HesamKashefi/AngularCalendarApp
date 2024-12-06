import { createAction, props } from "@ngrx/store";


export const fetchAppointments = createAction('[app-actions] fetch appointments');
export const setAppointments = createAction('[app-actions] set appointments', props<{ appointments: any[] }>());