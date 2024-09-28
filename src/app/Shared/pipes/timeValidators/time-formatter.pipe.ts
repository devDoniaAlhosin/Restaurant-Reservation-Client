import { Pipe, PipeTransform } from '@angular/core';
import { parse, format } from 'date-fns';

@Pipe({
  name: 'timeFormatter'
})
export class TimeFormatterPipe implements PipeTransform {
  transform(value: string): string {
    try {
      const time = parse(value, 'HH:mm', new Date());
      return format(time, 'hh:mm a'); // Convert to hh:mm AM/PM format
    } catch (error) {
      return 'Invalid Time Format';
    }
  }
}

