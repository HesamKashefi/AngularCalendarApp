import { inject, Pipe, type PipeTransform } from '@angular/core';
import { CalendarService } from '../services/Calendar.service';

@Pipe({
    name: 'appDisplayFullDate',
    pure: true
})
export class DisplayFullDatePipe implements PipeTransform {
    constructor(private calendarService: CalendarService) { }

    transform(value: unknown, ...args: unknown[]): unknown {

        if (value instanceof Date) {
            return this.calendarService.getDateString(value);
        }

        return value;
    }

}
