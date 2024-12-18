import { Component, computed, DestroyRef, inject, Input, OnInit, signal, WritableSignal } from '@angular/core';
import { AppointmentDialogData, AppointmentDialogComponent, AppointmentDialogResult } from '../../appointment-dialog/appointment-dialog.component';
import { Store } from '@ngrx/store';
import { Appointment } from '../../../models/appointment';
import { MatDialog } from '@angular/material/dialog';
import { DisplayDatePipe } from '../../../pipes/DisplayDate.pipe';
import * as actions from '../../../store/actions/appointments.actions';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { CalendarService } from '../../../services/Calendar.service';

@Component({
  selector: 'app-calendar-day',
  imports: [
    DisplayDatePipe,

    CdkDrag,
    CdkDropList,
    MatButtonModule
  ],
  templateUrl: './calendar-day.component.html',
  styleUrl: './calendar-day.component.scss'
})
export class CalendarDayComponent implements OnInit {
  private destroyRef$ = inject(DestroyRef);

  @Input({ required: true })
  date!: Date;

  @Input({ required: true })
  currentDate: WritableSignal<number> = signal(new Date().getTime());

  appointments: Appointment[] = [];

  isThisDateInTheCurrentMonthScope = computed(() => {
    return this.date.getMonth() === new Date(this.currentDate()).getMonth();
  });

  isThisDateEqualToToday = computed(() => {
    const now = new Date();
    return this.calendarService.areDatesEqual(this.date, now);
  });

  constructor(
    private calendarService: CalendarService,
    private store: Store<{ appointments: Appointment[] }>,
    private router: Router,
    private matDialog: MatDialog) {
  }

  ngOnInit(): void {
    this.handleStoreEvents();
  }


  private handleStoreEvents() {
    this.store
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe(state => {
        // filter for current date's appointments
        this.appointments = state.appointments
          .filter(x => x.date.getTime() === this.date.getTime())
          .sort((a, b) => (new Date('2025-01-01T' + a.time).getTime() - new Date('2025-01-01T' + b.time).getTime()));
      });
  }

  onOpenDate() {
    const dateString = this.calendarService.getDateString(this.date);
    this.router.navigate(['/day', dateString]);
  }

  onEditAppointment(appointment: Appointment) {
    const data: AppointmentDialogData = {
      date: this.date,
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


  dropAppointment(event: CdkDragDrop<Appointment[], Appointment, any>) {
    const appointment: Appointment = { ...event.item.data, date: new Date(this.date.getTime()) }
    this.store.dispatch(actions.appointmentsActions.updateAppointment({ appointment: appointment }))
  }
}
