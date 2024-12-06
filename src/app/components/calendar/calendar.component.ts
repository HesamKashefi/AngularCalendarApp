import { Component, DestroyRef, effect, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CalendarService } from '../../services/Calendar.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DisplayMonthPipe } from '../../pipes/DisplayMonth.pipe';
import { Store } from '@ngrx/store';
import { Appointment } from '../../models/appointment';
import * as actions from '../../store/actions/appointments.actions';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CalendarDayComponent } from './calendar-day/calendar-day.component';
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
const listAnimation = trigger('listAnimation', [
  transition(':enter', [
    query('*',
      [style({ opacity: 0 }), stagger('60ms', animate('600ms ease-out', style({ opacity: 1 })))],
      { optional: true }
    ),
  ])
]);
@Component({
  selector: 'app-calendar',
  imports: [
    CalendarDayComponent,

    DisplayMonthPipe,

    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  animations: [listAnimation]
})
export class CalendarComponent implements OnInit {
  private destroyRef$ = inject(DestroyRef);

  /**
   * represents the current time
   * (A bug in Angular does not pick up changes if we use Date as the type)
   */
  currentDate: WritableSignal<number> = signal(new Date().getTime());
  currentMonthCalendar?: Date[][];

  appointments: Appointment[] = [];

  private dateUpdateEffect = effect(() => {
    this.currentMonthCalendar = this.calendarService.generateMonth(new Date(this.currentDate()));
  })

  constructor(
    private store: Store<{ appointments: Appointment[] }>,
    private calendarService: CalendarService) {
  }

  ngOnInit(): void {
    this.store
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe(state => this.appointments = state.appointments);

    this.store.dispatch(actions.appointmentsAPIActions.fetchAllAppointments());
  }

  onGoToNextMonth() {
    this.currentDate.update(current => {
      const date = new Date(current);
      date.setMonth(date.getMonth() + 1);
      return date.getTime();
    });
  }

  onGoToPreviousMonth() {
    this.currentDate.update(current => {
      const date = new Date(current);
      date.setMonth(date.getMonth() - 1);
      return date.getTime();
    });
  }

  timeToDate(time: number) {
    return new Date(time);
  }
}
