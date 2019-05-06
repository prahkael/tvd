// *****************************************************************************
// Imports
// *****************************************************************************

import { Injectable }         from '@angular/core';
import { Http }               from '@angular/http';
import { Response }           from '@angular/http';
import { Headers }            from '@angular/http';
import { BaseRequestOptions } from '@angular/http';
import { Observable }         from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Role } from './'

// *****************************************************************************
// Service
// *****************************************************************************

@Injectable()
export class RoleService {
  
  // ***************************************************************************
  // Private properties
  // ***************************************************************************

  private _strURLRoleMeta = '/api/roles/meta';
  private _strURLRole     = '/api/roles/:id';
  private _strURLRoles    = '/api/roles';

  // ***************************************************************************
  // Public methods
  // ***************************************************************************

  constructor (
    private _http: Http
  ){}

  // ***************************************************************************
  // CRUD methods
  // ************
  
  createRole(role: Role): Observable<Role> {
    return this._handleObservable(
      this._http.post(this._strURLRoles, { data: role.getRequestFormat() }));
  }

  // ***************************************************************************

  readRole(strRoleID: string): Observable<Role> {
    return this._handleObservable(
      this._http.get(this._strURLRole.replace(':id', strRoleID)));
  }
  
  // ***************************************************************************
  
  readRoles(): Observable<Role[]> {
    return this._handleObservable(
      this._http.get(this._strURLRoles));
  }

  // ***************************************************************************
  
  updateRole(role: Role): Observable<Role> {
    return this._handleObservable(
      this._http.put(this._strURLRole.replace(':id', ''+role._id), { data: role.getRequestFormat() }));
  }

  // ***************************************************************************
  
  deleteRole(numRoleId: String): Observable<boolean> {
    return this._handleObservable(
      this._http.delete(this._strURLRole.replace(':id', ''+numRoleId)));
  }

  // ***************************************************************************
  // Misc methods
  // ************

  readRoleMeta(): Observable<any> {
    return this._handleObservable(
      this._http.get(this._strURLRoleMeta));
  }

  // ***************************************************************************
  // Private methods
  // ***************************************************************************

  private _handleObservable(observable: Observable<any>) {
    return observable
      .map(this._extractData.bind(this))
      .catch(this._handleError.bind(this))
  }

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
    return Observable.throw(errMsg);
  }
}

// *****************************************************************************
