import { createReducer, on } from "@ngrx/store";
import { AppState } from "../app.state";
import * as actions from "../actions/app.actions";

export const initialState: AppState = {
    appointments: []
};

export const appReducer = createReducer(initialState,
    on(actions.setAppointments, (state, { appointments }) => ({ ...state, appointments }))
);