import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { Appointment } from "../../models/appointment";


export const appointmentsActions = createActionGroup({
    source: 'Appointments',
    events: {
        'Add Appointment': props<{ appointment: Appointment }>(),
        'Remove Appointment': props<{ appointmentId: string }>(),
        'Set Appointments': props<{ appointments: Appointment[] }>(),
    }
})


export const appointmentsAPIActions = createActionGroup({
    source: 'Appointments API',
    events: {
        'Fetch All Appointments': emptyProps()
    }
})