// *****************************************************************************
// Imports
// *****************************************************************************

import { Injectable }         from '@angular/core';
import { Http }               from '@angular/http';
import { XHRBackend }         from '@angular/http';
import { RequestOptions }     from '@angular/http';
import { Request }            from '@angular/http';
import { RequestOptionsArgs } from '@angular/http';
import { Response }           from '@angular/http';
import { Headers }            from '@angular/http';
import { Router }             from '@angular/router';
import { Observable }         from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { LoadingSpinnerService } from '../../shared/loading-spinner';

// *****************************************************************************
// Service
// *****************************************************************************

@Injectable()
export class HttpService extends Http {

  // *****************************************************************************

  constructor (
    backend: XHRBackend,
    requestOptions: RequestOptions,
    private _router: Router,
    private _spinner: LoadingSpinnerService,
  ) {
    super(backend, requestOptions);
  }

  // *****************************************************************************

  request(mixRequest: string|Request, options?: RequestOptionsArgs): Observable<Response> {
    this._spinner.add();

    const requestOptionsEdited = this._setOptions();
    let strURL    : string;
    let objRequest: Request;

    if ('string' === typeof mixRequest) {
      strURL = mixRequest;
      this._setOptions(options)
    }
    else if (mixRequest instanceof Request) {
      objRequest = mixRequest;
      this._extendHeaders(objRequest.headers);
    }

    return (super
      .request(objRequest, options)
      .finally(() => this._spinner.remove())
      .catch(this._catchAuthError.bind(this))
    );
  }

  // *****************************************************************************

  private _catchAuthError(res: Response) {
    if (res.status === 401) {
      this._router.navigate(['/sign-in']);
    }
    else if (res.status === 403) {
      this._router.navigate(['/error']);
    }
    return Observable.of(res);
  }
  
  // *****************************************************************************

  private _setOptions(options?: RequestOptions|RequestOptionsArgs): RequestOptions|RequestOptionsArgs {
    if (!options) {
      options = new RequestOptions();
    }
    if (!options.headers) {
      options.headers = new Headers();
    }
    options.withCredentials = true;

    this._extendHeaders(options.headers);
    return options;
  }

  // *****************************************************************************

  private _extendHeaders(headers: Headers): Headers {
    const token : string = localStorage.getItem('token');
    const userId: string = localStorage.getItem('userId');

    if (token) {
      headers.append('Authorization', 'Bearer ' + token);
    }
    if (userId) {
      headers.append('User-ID', userId);
    }
    headers.append('Content-Type', 'application/json');
    return headers;
  }

  // *****************************************************************************
}

// *****************************************************************************
// Provider
// *****************************************************************************

export const HttpProvider = {
  provide : Http,
  useClass: HttpService
};

// *****************************************************************************
