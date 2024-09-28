import { Pipe, PipeTransform } from '@angular/core';
import { format, isFuture, isAfter, subMonths, addMonths, parse } from 'date-fns';

@Pipe({
  name: 'dateValidator'
})
export class DateValidatorPipe implements PipeTransform {
  transform(value: string, ...args: any[]): string {
    const currentDate = new Date();
    const parsedDate = parse(value, 'yyyy-MM-dd', new Date());

    // Check if the date is not in the past and within 3 months from today
    const threeMonthsLater = addMonths(currentDate, 3);

    if (!isAfter(parsedDate, currentDate)) {
      return 'Invalid: Date is in the past';
    }

    if (isAfter(parsedDate, threeMonthsLater)) {
      return 'Invalid: Date is beyond the 3-month limit';
    }

    return format(parsedDate, 'MM/dd/yyyy'); // Formatting to MM/DD/YYYY
  }
}

