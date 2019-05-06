// *****************************************************************************
// Imports
// *****************************************************************************

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BaseResponseOptions, ResponseOptions, ResponseOptionsArgs } from '@angular/http';

// *****************************************************************************
// Service
// *****************************************************************************

@Injectable()
export class ResponseInterceptorOptions extends BaseResponseOptions {

  constructor(
    private _router: Router
  ){ super(); }

  merge(options?: ResponseOptionsArgs) : ResponseOptions {
    if (options.status === 401) {
      this._router.navigate(['/sign-in']);
    }
    return super.merge(options);
  }
}

// *****************************************************************************
// Provider
// *****************************************************************************

export const responseInterceptorOptionsProvider = {
  provide : ResponseOptions,
  useClass: ResponseInterceptorOptions
};

// *****************************************************************************
