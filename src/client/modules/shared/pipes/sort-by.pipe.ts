// *****************************************************************************
// Vendor imports
// *****************************************************************************

import { Pipe, PipeTransform } from '@angular/core';

// *****************************************************************************
// Pipe definition
// *****************************************************************************

@Pipe({ name: 'sortBy' })
export class SortByPipe implements PipeTransform {

  transform(arr: Array<Object>, strSortKey: string, numSortFlow: number): Object[] {
    if (!arr) {
      return;
    }
    return arr.sort((objA, objB) => {
      if ('string' === typeof objA[strSortKey] &&
          objA[strSortKey].toLowerCase() > objB[strSortKey].toLowerCase()) {
        return 1 * numSortFlow;
      }
      else if ('string' === typeof objA[strSortKey] &&
          objA[strSortKey].toLowerCase() < objB[strSortKey].toLowerCase()) {
        return -1 * numSortFlow;
      }
      else if ('number' === typeof objA[strSortKey]) {
        return (objA[strSortKey] - objB[strSortKey]) * numSortFlow;
      }
      return 0;
    });
  }
}

// *****************************************************************************
