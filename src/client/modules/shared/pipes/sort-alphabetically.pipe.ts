// *****************************************************************************
// Vendor imports
// *****************************************************************************

import { Pipe, PipeTransform } from '@angular/core';

// *****************************************************************************
// Pipe definition
// *****************************************************************************

@Pipe({ name: 'sort' })
export class SortAlphabetically implements PipeTransform {

  transform(arr: Array<Object>, strSortKey: string, numSortFlow: number = 1): Object[] {
    if (!arr) {
      return;
    }
    return arr.sort((strA: string, strB: string) => {
      if (strA.toLowerCase() > strB.toLowerCase()) {
        return 1 * numSortFlow;
      }
      if (strA.toLowerCase() < strB.toLowerCase()) {
        return -1 * numSortFlow;
      }
      return 0;
    });
  }
}

// *****************************************************************************
