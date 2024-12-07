import { Pipe, type PipeTransform } from '@angular/core';

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

@Pipe({
  name: 'appDisplayMonth',
  pure: true
})
export class DisplayMonthPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    if (value instanceof Date) {
      const month = new Date(value).getMonth();
      return `${value.getFullYear()} - ${monthNames[month]}`;
    }


    return value;
  }

}
