import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-day-view',
  imports: [],
  templateUrl: './day-view.component.html',
  styleUrl: './day-view.component.scss'
})
export class DayViewComponent implements OnInit {
  date?: Date;

  constructor(
    private route: ActivatedRoute,
    private router: Router) {

  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const date: string = params['date'];
      this.date = new Date(date);
      console.log(this.date);
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
