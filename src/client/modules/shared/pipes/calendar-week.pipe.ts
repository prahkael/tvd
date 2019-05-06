// *****************************************************************************
// Vendor imports
// *****************************************************************************

import { Pipe, PipeTransform } from '@angular/core';

// *****************************************************************************
// Pipe definition
// *****************************************************************************

@Pipe({ name: 'calendarWeek' })
export class CalendarWeekPipe implements PipeTransform {

  transform(strDate: string): number {
    if (!strDate) {
      return;
    }
    return _getWeekNumber(new Date(strDate))[1];
  }
}

// *****************************************************************************
// Helpers
// *****************************************************************************

function _getWeekNumber(d: Date): number[] {

    // Copy date so don't modify original
    d = new Date(+d);
    
    // Note that hours need to be zeroed in case a date object is passed with a late time.
    d.setHours(0, 0, 0, 0);

    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));

    // Get first day of year
    var yearStart = new Date(d.getFullYear(), 0, 1);

    // Calculate full weeks to nearest Thursday
    var numWeekNumber = Math.ceil((((+d - +yearStart) / 86400000) + 1)/7);

    // Return array of year and week number
    return [d.getFullYear(), numWeekNumber];
}

// *****************************************************************************
