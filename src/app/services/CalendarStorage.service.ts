import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Appointment } from '../models/appointment';

@Injectable({
  providedIn: 'root'
})
export class CalendarStorageService {

  constructor() { }

  getAppointments(): Observable<{ appointments: Appointment[] }> {
    const state = localStorage.getItem("_state_");
    if (!state)
      return of({ appointments: [] })

    let appointments: Appointment[] = JSON.parse(state)?.appointments || [];

    // fix type for dates
    appointments = appointments.map(x => {
      x.date = new Date(x.date);
      return x;
    })

    return of({ appointments });
  }
}
