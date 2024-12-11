import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Appointment } from '../../../models/appointment';
import { CalendarService } from '../../../services/Calendar.service';
import { MatButtonModule } from '@angular/material/button';
import { DisplayFullDatePipe } from '../../../pipes/display-full-date.pipe';
import { AppointmentDialogComponent, AppointmentDialogData, AppointmentDialogResult } from '../../appointment-dialog/appointment-dialog.component';
import * as actions from '../../../store/actions/appointments.actions';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-day-view',
  imports: [
    DisplayFullDatePipe,

    RouterLink,
    MatButtonModule
  ],
  templateUrl: './day-view.component.html',
  styleUrl: './day-view.component.scss'
})
export class DayViewComponent implements OnInit {
  date?: Date;
  hours: number[] = [...Array(24).keys()];
  appointments: Appointment[] = [];

  constructor(
    private calendarService: CalendarService,
    private store: Store<{ appointments: Appointment[] }>,
    private route: ActivatedRoute,
    private matDialog: MatDialog) {

  }

  ngOnInit(): void {
    this.store.dispatch(actions.appointmentsAPIActions.fetchAllAppointments());

    this.route.params.subscribe(params => {
      const date: string = params['date'];
      this.date = new Date(date);
      console.log(this.date);
    });

    this.store.select(x => x.appointments)
      .subscribe(appointments => {
        this.appointments = appointments
          .filter(x => {
            console.log(x, new Date(x.date), this.calendarService.getDateString(new Date(x.date)), new Date(this.calendarService.getDateString(new Date(x.date))));

            return this.calendarService.areDatesEqual(new Date(this.calendarService.getDateString(new Date(x.date))), this.date!);
          });
      })
  }

  getAppointmentsByHour(hour: number) {
    return this.appointments.filter(x => {
      const dateString = this.calendarService.getDateString(this.date!);
      const appointmentDateTime = new Date(`${dateString}T${x.time}:00.000Z`).getTime();
      const currentHour = new Date(`${dateString}T${String(hour).padStart(2, '0')}:00:00.000Z`);
      const nextHour = new Date(`${dateString}T${String(hour).padStart(2, '0')}:00:00.000Z`);
      nextHour.setHours(currentHour.getHours() + 1);

      return currentHour.getTime() <= appointmentDateTime &&
        appointmentDateTime < nextHour.getTime();
    });
  }

  onCreateAppointment() {
    const data: AppointmentDialogData = {
      date: this.date!
    };

    const dialogRef = this.matDialog.open(AppointmentDialogComponent,
      {
        data,
        width: '70%'
      }
    );

    dialogRef
      .afterClosed()
      .subscribe((result: AppointmentDialogResult) => {
        if (!result) return;
        this.store.dispatch(actions.appointmentsActions.addAppointment({ appointment: result }))
      });
  }


  onEditAppointment(appointment: Appointment) {
    const data: AppointmentDialogData = {
      date: this.date!,
      appointment
    };

    const dialogRef = this.matDialog.open(AppointmentDialogComponent,
      {
        data,
        width: '70%'
      }
    );

    dialogRef
      .afterClosed()
      .subscribe((result: AppointmentDialogResult) => {
        if (!result) return;
        this.store.dispatch(actions.appointmentsActions.updateAppointment({ appointment: result }))
      });
  }
}
