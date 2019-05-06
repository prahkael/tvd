// *****************************************************************************
// Imports
// *****************************************************************************

import { Injectable }         from '@angular/core';
import { BaseRequestOptions } from '@angular/http';
import { RequestOptions }     from '@angular/http';
import { RequestOptionsArgs } from '@angular/http';
import { Headers }            from '@angular/http';

// *****************************************************************************
// Service
// *****************************************************************************

@Injectable()
export class RequestInterceptorOptions extends BaseRequestOptions {

  merge(options?: RequestOptionsArgs): RequestOptions {
    const token: string  = localStorage.getItem('token');
    const userId: string = localStorage.getItem('userId');

    if (!options) {
      options = new RequestOptions();
    }
    if (!options.headers) {
      options.headers = new Headers();
    }
    if (token) {
      options.headers.append('Authorization', 'Bearer ' + token);
    }
    if (userId) {
      options.headers.append('User-ID', userId);
    }

    options.headers.append('Content-Type', 'application/json');
    options.withCredentials = true;

    const merged = super.merge(options);
    return merged;
  }
}

// *****************************************************************************
// Provider
// *****************************************************************************

export const requestInterceptorOptionsProvider = {
  provide : RequestOptions,
  useClass: RequestInterceptorOptions
};

// *****************************************************************************
