// *****************************************************************************
// Imports
// *****************************************************************************

import { Injectable }             from '@angular/core';
import { CanActivate }            from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';
import { RouterStateSnapshot }    from '@angular/router';

import { AuthService } from './';

// *****************************************************************************
// Service
// *****************************************************************************

@Injectable()
export class AuthGuardService implements CanActivate {

  // ***************************************************************************
  // Public methods
  // ***************************************************************************

  constructor(
    private _authService: AuthService
  ){}
  
  // ***************************************************************************

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._authService.isAuthenticatedAndAuthorizedForURL(state.url);
  }

  // ***************************************************************************
  // Private methods
  // ***************************************************************************
  // ***************************************************************************
}

// *****************************************************************************

