import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor() { }

  /**
   * generates dates needed to display in a calendar for a month
   * @param date a date to determine the month
   * @returns an array of date arrays, representing each row in the calendar
   */
  generateMonth(date: Date): Date[][] {
    const month: { row: number, date: Date }[] = [];

    const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
    const weekDayForTheFirstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const lastDayOfPreviousMonth = new Date(date.getFullYear(), date.getMonth(), 0);

    // add last days of the prev month
    for (let dayInRow = weekDayForTheFirstDayOfMonth - 1; dayInRow >= 0; dayInRow--) {
      month.push({
        row: 0,
        date: new Date(lastDayOfPreviousMonth.getTime() - oneDayInMilliseconds * dayInRow)
      })
    }

    // add current month
    const tempDate = new Date(date.getFullYear(), date.getMonth(), 1);
    while (tempDate.getMonth() === date.getMonth()) {
      month.push({
        row: Math.floor(month.length / 7),
        date: new Date(tempDate.getTime())
      });
      tempDate.setDate(tempDate.getDate() + 1);
    }

    // add first days of next month
    while (tempDate.getDay() !== 0) {
      month.push({
        row: Math.floor(month.length / 7),
        date: new Date(tempDate.getTime())
      })
      tempDate.setDate(tempDate.getDate() + 1);
    }

    // map row numbers to arrays
    const dic: { [row: number]: Date[] } = {};
    month.reduce((rv, x) => {
      (rv[x.row] = rv[x.row] || []).push(x.date);
      return rv;
    }, dic);

    return Object.keys(dic).map(x => dic[+x]);
  }

  /**
   * calculates the number of days in the specified month of year
   * @param year year
   * @param month month (0 for January to 11 for december)
   * @returns number of days in the month
   */
  private getNumberOfDaysInMonth(year: number, month: number) {
    // using 0 as the day, will cause to create a date that points to the last
    // day of the previous month
    // so we also need to increment the month by one
    // so the result is last day of the current month
    return new Date(year, month + 1, 0).getDate();
  }

}
