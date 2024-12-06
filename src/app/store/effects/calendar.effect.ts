import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { CalendarStorageService } from "../../services/CalendarStorage.service";
import * as actions from "../actions/appointments.actions";
import { exhaustMap, map } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CalendarEffect {

    fetchCalendar = createEffect(() => {
        const service = inject(CalendarStorageService);
        return inject(Actions).pipe(
            ofType(actions.appointmentsAPIActions.fetchAllAppointments),
            exhaustMap(p => {
                return service.getAppointments()
                    .pipe(map(result => {
                        return actions.appointmentsActions.setAppointments({ appointments: result.appointments })
                    }));
            })
        )
    }
    )
}