// *****************************************************************************
// Imports
// *****************************************************************************

import { Injectable }            from '@angular/core';
import { Http }                  from '@angular/http';
import { Response }              from '@angular/http';
import { Headers }               from '@angular/http';
import { BaseRequestOptions }    from '@angular/http';
import { Observable }            from 'rxjs/Observable';
import { Order }           from '.';
import { RequestDataOptions }    from '../shared';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

// *****************************************************************************
// Service
// *****************************************************************************

@Injectable()
export class OrderService {
  
  // ***************************************************************************
  // Private properties
  // ***************************************************************************
  
  private strURL        = '/api/orders';
  private strURLHeaders = '/api/orders/headers';
  private strURLFilters = '/api/orders/filters';

  // ***************************************************************************
  // Public properties
  // ***************************************************************************

  objMeta: Object = {};

  // ***************************************************************************
  // Public methods
  // ***************************************************************************

  constructor (
    private _http: Http,
  ){}

  // ***************************************************************************

  readOrders(options: RequestDataOptions): Observable<Object> {
    return this._http
      .get(this.strURL, { search: options.getURLFormat() })
      .distinctUntilChanged()
      .map((res: Response) => res.json() || {})
      .catch(this._handleError.bind(this))
      .retry(2)
      ;
  }

  // ***************************************************************************

  readOrderHeaders(): Observable<Object> {
    return this._http
      .get(this.strURLHeaders)
      .distinctUntilChanged()
      .map((res: Response) => res.json() || {})
      .catch(this._handleError.bind(this))
      .retry(2)
      ;
  }

  // ***************************************************************************

  readOrderFilters(): Observable<Object> {
    return this._http
      .get(this.strURLFilters)
      .distinctUntilChanged()
      .map((res: Response) => res.json() || {})
      .catch(this._handleError.bind(this))
      .retry(2)
      ;
  }

  // ***************************************************************************
  // Private methods
  // ***************************************************************************

  private _handleError (error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    // console.error(errMsg);
    return Observable.throw(errMsg);
  }

  // *****************************************************************************
}

// *****************************************************************************
