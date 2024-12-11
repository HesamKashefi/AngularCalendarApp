import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Appointment } from '../../../models/appointment';
import { CalendarService } from '../../../services/Calendar.service';
import { MatButtonModule } from '@angular/material/button';
import { DisplayFullDatePipe } from '../../../pipes/dispaly-full-date.pipe';

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
    private router: Router) {

  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const date: string = params['date'];
      this.date = new Date(date);
      console.log(this.date);
    });

    this.store.select(x => x.appointments)
      .subscribe(x => this.appointments = x)
  }

  getAppointmentsByHour(hour: number) {
    return this.appointments.filter(x => {
      const dateString = this.calendarService.getDateString(this.date!);
      const appointmentDateTime = new Date(`${dateString}T${x.time}`).getTime();
      const currentHour = new Date(`${dateString}T${hour}:00:00`);
      const nextHour = new Date(`${dateString}T${hour}:00:00`);
      nextHour.setHours(currentHour.getHours() + 1);

      return currentHour.getTime() <= appointmentDateTime &&
        appointmentDateTime < nextHour.getTime();
    });
  }

  onCreateAppointment() {
    // const data: AppointmentDialogData = {
    //   date: this.date
    // };

    // const dialogRef = this.matDialog.open(AppointmentDialogComponent,
    //   {
    //     data,
    //     width: '70%'
    //   }
    // );

    // dialogRef
    //   .afterClosed()
    //   .subscribe((result: AppointmentDialogResult) => {
    //     if (!result) return;
    //     this.store.dispatch(actions.appointmentsActions.addAppointment({ appointment: result }))
    //   });
  }

}
