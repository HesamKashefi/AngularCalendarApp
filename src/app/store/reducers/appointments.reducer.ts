import { createReducer, on } from "@ngrx/store";
import * as actions from "../actions/appointments.actions";
import { Appointment } from "../../models/appointment";

export const initialState: Appointment[] = [];

export const appReducer = createReducer(initialState,
    on(actions.appointmentsActions.setAppointments, (state, { appointments }) => ([...appointments])),
    on(actions.appointmentsActions.addAppointment, (state, { appointment }) => {
        if (state.map(x => x.appointmentId).indexOf(appointment.appointmentId) > -1) return state;

        return [...state, appointment];
    }),
    on(actions.appointmentsActions.removeAppointment, (state, { appointmentId }) => {
        return state.filter(x => x.appointmentId !== appointmentId);
    }),
    on(actions.appointmentsActions.updateAppointment, (state, { appointment }) => {
        const temp = state.filter(x => x.appointmentId !== appointment.appointmentId);
        temp.push(appointment);
        return temp;
    }),
);