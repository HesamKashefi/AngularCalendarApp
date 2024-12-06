import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'appDisplayDate',
  pure: true
})
export class DisplayDatePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {

    if (value instanceof Date) {
      return new Date(value).getDate();
    }

    return value;
  }

}
