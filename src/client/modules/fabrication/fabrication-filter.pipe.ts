// *****************************************************************************
// Imports
// *****************************************************************************

import { Pipe, PipeTransform } from '@angular/core';
import { Fabrication }         from './';

// *****************************************************************************
// Locals
// *****************************************************************************

type ObjFilters = { [strKey: string]: string };

// *****************************************************************************
// Pipe
// *****************************************************************************

@Pipe({ name: 'filterFabricationsBy', pure: false })
export class FilterFabricationsByPipe implements PipeTransform {

  transform(arr: Array<Object>, objFilters: ObjFilters): Array<Object> {
    if (!arr) {
      return;
    }

    return arr.filter((fabrication: Fabrication) => {
      let isInResult = true;
      Object.keys(objFilters).forEach(strKey => {
        isInResult = isInResult && (
          fabrication[strKey] === objFilters[strKey] ||
          fabrication[strKey] === +objFilters[strKey]
        );
      });
      return isInResult;
    });
  }
}

// *****************************************************************************
