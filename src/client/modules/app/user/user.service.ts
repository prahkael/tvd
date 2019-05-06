// *****************************************************************************
// Imports
// *****************************************************************************

import { Injectable }            from '@angular/core';
import { Http }                  from '@angular/http';
import { Response }              from '@angular/http';
import { Headers }               from '@angular/http';
import { BaseRequestOptions }    from '@angular/http';
import { Observable }            from 'rxjs/Observable';

import { User }                  from './'

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

// *****************************************************************************
// Service
// *****************************************************************************

@Injectable()
export class UserService {

  // ***************************************************************************
  // Private properties
  // ***************************************************************************

  private strURLUsersMeta = '/api/users/meta';
  private strURLUsers     = '/api/users';
  private strURLUser      = '/api/users/:id';

  // ***************************************************************************
  // Public methods
  // ***************************************************************************

  constructor (
    private _http: Http
  ){}

  // ***************************************************************************
  // CRUD methods
  // ************
  
  createUser(user: User): Observable<User> {
    return this._http
      .post(this.strURLUsers, { user })
      .map(this._extractData.bind(this))
      .catch(this._handleError.bind(this))
      ;
  }

  // ***************************************************************************

  readUser(userId: string): Observable<User> {
    return this._http
      .get(this.strURLUser.replace(':id', userId))
      .map(this._extractData.bind(this))
      .catch(this._handleError.bind(this));
      ;
  }
  
  // ***************************************************************************
  
  readUsers(): Observable<User[]> {
    return this._http
      .get(this.strURLUsers)
      .map(this._extractData.bind(this))
      .catch(this._handleError.bind(this))
      ;
  }

  // ***************************************************************************
  
  updateUser(user: User): Observable<User> {
    return this._http
      .put(this.strURLUser.replace(':id', user._id), { user })
      .map(this._extractData.bind(this))
      .catch(this._handleError.bind(this))
      ;
  }

  // ***************************************************************************
  
  deleteUser(userId: string): Observable<boolean> {
    return this._http
      .delete(this.strURLUser.replace(':id', userId))
      .map(this._extractData.bind(this))
      .catch(this._handleError.bind(this))
      ;
  }
  
  // ***************************************************************************
  // Misc methods
  // ************

  readUserMeta(): Observable<any> {
    return this._http
      .get(this.strURLUsersMeta)
      .map(this._extractData.bind(this))
      .catch(this._handleError.bind(this));
      ;
  }

  // ***************************************************************************
  // Private methods
  // ***************************************************************************

  private _extractData(res: Response) {
    let body = res.json();
    return body.data || { };
  }

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
