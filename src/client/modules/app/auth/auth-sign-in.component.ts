// *****************************************************************************
// Imports
// *****************************************************************************

import { Component }   from '@angular/core';
import { Router }      from '@angular/router';
import { User }        from '../user';
import { AuthService } from './';

// *****************************************************************************
// Interfaces
// *****************************************************************************

interface IntSuccessResult {
  token: string,
  user: User,
  timestamp: number
}

// *****************************************************************************
// Component
// *****************************************************************************

@Component({
  selector: 'dl-auth-sign-in',
  templateUrl: './auth-sign-in.component.html',
  styleUrls: ['./auth.css', './auth-sign-in.component.css']
})
export class AuthSignInComponent {

  // *****************************************************************************
  // Public properties
  // *****************************************************************************

  strUsername      : string;
  strPassword      : string;
  isRemembered     : boolean = false;
  isSignInIncorrect: boolean = false;

  // *****************************************************************************
  // Private properties
  // *****************************************************************************

  private _strURLRedirect = '/fabrications';
  
  // *****************************************************************************
  // Public methods
  // *****************************************************************************

  constructor(
    private _router: Router,
    private _authService: AuthService,
  ){}

  // *****************************************************************************

  doSignIn() {
    return this._authService
      .signIn(this.strUsername, this.strPassword, this.isRemembered)
      .subscribe(
        this._handleSignInSuccess.bind(this),
        this._handleSignInError.bind(this)
      );
  }

  // *****************************************************************************
  // Private methods
  // *****************************************************************************

  private _handleSignInSuccess(isSignedIn: boolean) {
    this.isSignInIncorrect = !isSignedIn;
    this._router.navigate([this._strURLRedirect]);
  }

  // *****************************************************************************
  
  private _handleSignInError(err: any) {
    this.isSignInIncorrect = true;
    console.error(err);
  }

  // *****************************************************************************
}
