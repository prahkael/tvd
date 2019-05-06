// *****************************************************************************
// Imports
// *****************************************************************************

import { Pipe, PipeTransform } from '@angular/core';
import { Order }         from '.';

// *****************************************************************************
// Locals
// *****************************************************************************

type ObjFilters = { [strKey: string]: string };

// *****************************************************************************
// Pipe
// *****************************************************************************

@Pipe({ name: 'filterOrdersBy', pure: false })
export class FilterOrdersByPipe implements PipeTransform {

  transform(arr: Array<Object>, objFilters: ObjFilters): Array<Object> {
    if (!arr) {
      return;
    }

    return arr.filter((order: Order) => {
      let isInResult = true;
      Object.keys(objFilters).forEach(strKey => {
        isInResult = isInResult && (
          order[strKey] === objFilters[strKey] ||
          order[strKey] === +objFilters[strKey]
        );
      });
      return isInResult;
    });
  }
}

// *****************************************************************************
