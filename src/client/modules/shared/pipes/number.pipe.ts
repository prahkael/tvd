// *****************************************************************************
// Vendor imports
// *****************************************************************************

import { Pipe, PipeTransform } from '@angular/core';

// *****************************************************************************
// Pipe definition
// *****************************************************************************

@Pipe({ name: 'number' })
export class NumberPipe implements PipeTransform {

  transform(
      mixNumber      : string|number,
      numDecimals    : number,
      strDecChar     : string,
      strThousandChar: string
  ): string {
    let strNumber: string = mixNumber+'';
    
    if (numDecimals >= 0) {
      strNumber = (+mixNumber).toFixed(numDecimals);
    }
    if (strDecChar) {
      strNumber = strNumber.replace('.', strDecChar);
    }
    if (strThousandChar) {
      strNumber = strNumber.replace(/\B(?=(\d{3})+(?!\d))/g, strThousandChar);
    }

    return strNumber.trim();
  }
}

// *****************************************************************************
