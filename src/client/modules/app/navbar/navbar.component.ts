// *****************************************************************************
// Imports
// *****************************************************************************

import { Component }   from '@angular/core';
import { Router }      from '@angular/router';
import { Observable }  from 'rxjs/Observable';

import { AuthService } from '../auth';

// *****************************************************************************
// Component
// *****************************************************************************

@Component({
  selector   : 'dl-navbar',
  templateUrl: './navbar.component.html',
  styleUrls  : ['./navbar.component.css']
})
export class NavbarComponent {

  // *****************************************************************************
  // Private methods
  // *****************************************************************************

  private _strURLSignIn: string = '/sign-in';

  // *****************************************************************************
  // Public methods
  // *****************************************************************************

  constructor(
    private _authService: AuthService,
    private _router     : Router,
  ) {}

  // *****************************************************************************

  doSignOut() {
    this._authService.signOut();
    this._router.navigate([this._strURLSignIn]);
  }

  // *****************************************************************************

  isSignedInLocal(): Observable<boolean> {
    return this._authService.isSignedInLocal();
  }

  // *****************************************************************************

  isAuthorizedForURL(strURL: string): Observable<boolean> {
    return this._authService.isAuthorizedForURL(strURL);
  }

  // *****************************************************************************
}

// *****************************************************************************
