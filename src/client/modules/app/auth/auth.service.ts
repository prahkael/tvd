// *****************************************************************************
// Imports
// *****************************************************************************

import { Injectable }            from '@angular/core';
import { Router }                from '@angular/router';
import { Http }                  from '@angular/http';
import { Response }              from '@angular/http';
import { Headers }               from '@angular/http';
import { RequestOptions }        from '@angular/http';
import { URLSearchParams }       from '@angular/http';
import { Observable }            from 'rxjs/Observable';
import { User }                  from '../user'
import { Role }                  from '../role';
import { RoleService }           from '../role';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

// *****************************************************************************
// Service
// *****************************************************************************

@Injectable()
export class AuthService {

  // ***************************************************************************
  // Public properties
  // ***************************************************************************

  strURLRedirect: string;

  // ***************************************************************************
  // Private properties
  // ***************************************************************************

  private _strURLSignIn     : string  = '/api/sign-in';
  private _strURLCheckSignIn: string  = '/api/is-signed-in';
  private _isSignedIn       : boolean = null;

  // ***************************************************************************
  // public methods
  // ***************************************************************************

  constructor(
    private _http       : Http,
    private _router     : Router,
    private _roleService: RoleService,
  ){}

  // ***************************************************************************

  signIn(username: string, password: string, isRemembered: boolean): Observable<Response> {
    this.signOut();

    const authHeader = btoa(username + ':' + password);
    const headers    = new Headers({ 'Authorization': `Basic ${authHeader}` });
    const options    = new RequestOptions();
    options.headers  = headers;

    if (isRemembered) {
      const params = new URLSearchParams();
      params.set('isRemembered', ''+isRemembered);
      options.params = params;
    }

    return this._http
      .get(this._strURLSignIn, options)
      .map(this._handleSignInSuccess.bind(this))
      .catch(this._handleError.bind(this))
      ;
  }

  // ***************************************************************************

  signOut() {
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    localStorage.removeItem('expiration');
    localStorage.removeItem('token');
    this._isSignedIn = false;
  }

  // ***************************************************************************

  isSignedIn(): Observable<boolean> {

    // On application load, the local data is checked for validation.
    // The property "_isSignedIn" is therefor initiated with "null".
    if (this._isSignedIn === null) {
      return this.isSignedInRemote();
    }

    // The local storage properties must be checked since
    // the user could still be signed in but could delete
    // the token or the expiration timestamp. If so, the user is
    // signed out automatically.
    const strUserId     =  localStorage.getItem('userId');
    const numExpiration = +localStorage.getItem('expiration');
    const strToken      =  localStorage.getItem('token');
    const isTimeOkay    =  numExpiration >= Math.floor(Date.now() / 1000);

    // console.log('strUserId: ', strUserId);
    // console.log('numExpiration: ', numExpiration);
    // console.log('strToken: ', strToken);
    // console.log('isTimeOkay: ', isTimeOkay);
    // console.log('this._isSignedIn: ', this._isSignedIn);

    // If the user ID is still set AND the token is still set
    // AND the expiration is still set AND the expiration is not
    // run out, yet, AND the user is marked as signed-in,
    // then return true.
    if (strUserId && numExpiration && strToken && isTimeOkay && this._isSignedIn) {
      return Observable.of(true);
    }

    // If check did not pass, sign out the user and return
    // to the sign-in view.
    this.signOut();
    return Observable.of(false);
  }

  // ***************************************************************************

  isSignedInLocal(): Observable<boolean> {
    if (this._isSignedIn === true) {
      return Observable.of(true);
    }
    return Observable.of(false);
  }

  // ***************************************************************************

  isSignedInRemote(): Observable<boolean> {
    return this._http
      .get(this._strURLCheckSignIn)
      .map(this._handleIsSignedInSuccess.bind(this))
      .catch(this._handleError.bind(this))
      ;
  }

  // ***************************************************************************

  isAuthorizedForURL(strURLCurrent: string): Observable<boolean> {
    if (this._isSignedIn === false) {
      return Observable.of(false);
    }

    strURLCurrent    = this._cleanURL(strURLCurrent);
    let strJSONRole  = localStorage.role;
    let isAuthorized = false;
    let role: Role;

    if (!strJSONRole) {
      return Observable.of(false);
    }

    try {
      role = new Role(JSON.parse(localStorage.role));
    } catch (err) {
      return Observable.throw(err);
    }

    if (role.isAdmin) {
      return Observable.of(true);
    }
    
    isAuthorized = role.arrResources.indexOf(strURLCurrent) >= 0;
    return Observable.of(isAuthorized);
  }

  // ***************************************************************************

  isAuthenticatedAndAuthorizedForURL(strURLCurrent: string): Observable<boolean> {
    const isAuthenticated$ = this.isSignedIn();
    const isAuthorized$    = this.isAuthorizedForURL(strURLCurrent);

    return isAuthenticated$.concat(isAuthorized$)
      .every(isAuth => !!isAuth)
      .catch(this._handleError.bind(this));
  }

  // ***************************************************************************
  // Private methods
  // ***************************************************************************

  private _cleanURL(strURL: string): string {

    strURL = strURL.replace(/^\//, '');  
    strURL = strURL.split('/')[0];
    strURL = strURL.split('?')[0];
    strURL = strURL.trim();

    return strURL;
  }

  // ***************************************************************************

  private _handleSignInSuccess(res: Response) {
    const body = res.json();
    const data = body.data || {};

    if (data.userId && data.expiration && data.token && data.role) {
      localStorage.setItem('userId',     data.userId);
      localStorage.setItem('expiration', data.expiration);
      localStorage.setItem('token',      data.token);
      localStorage.setItem('role',       JSON.stringify(data.role));
      this._isSignedIn = true;
      return true;
    }

    return false;
  }

  // *****************************************************************************

  private _handleIsSignedInSuccess(res: Response) {
    const body = res.json();
    const data = body.data || {};

    if (body.data.isSignedIn) {
      this._isSignedIn = true;
      return true;
    }

    return false;
  }

  // *****************************************************************************

  private _handleError(err: Response | any) {
    console.error(err);
    return Observable.throw(err);
  }

  // *****************************************************************************

}

// *****************************************************************************
