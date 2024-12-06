import { Component, effect, OnInit, signal, WritableSignal } from '@angular/core';
import { DisplayDatePipe } from '../../pipes/DisplayDate.pipe';
import { CalendarService } from '../../services/Calendar.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DisplayMonthPipe } from '../../pipes/DisplayMonth.pipe';

@Component({
  selector: 'app-calendar',
  imports: [
    DisplayDatePipe,
    DisplayMonthPipe,

    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit {

  currentDate: WritableSignal<number> = signal(new Date().getTime());
  currentMonthCalendar?: Date[][];

  private dateUpdateEffect = effect(() => {
    this.currentMonthCalendar = this.calendarService.generateMonth(new Date(this.currentDate()));
  })

  constructor(private calendarService: CalendarService) {
  }

  ngOnInit(): void {
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

  isInTheCurrentMonth(date: Date) {
    return date.getMonth() === new Date(this.currentDate()).getMonth();
  }

  timeToDate(time: number) {
    return new Date(time);
  }

}
