// *****************************************************************************
// Vendor imports
// *****************************************************************************

import { Pipe, PipeTransform } from '@angular/core';

// *****************************************************************************
// Pipe definition
// *****************************************************************************

@Pipe({ name: 'pan' })
export class PanPipe implements PipeTransform {

  transform(mixTerm: string|number, numLenFinal: number = 2, strItem: string = '0'): string {
    const strTerm = ''+mixTerm;
    const numRest = numLenFinal - strTerm.length;

    if (numRest <= 0) {
      return strTerm;
    }

    return ((new Array(numRest)).fill(strItem)).join('') + strTerm;
  }
}

// *****************************************************************************
