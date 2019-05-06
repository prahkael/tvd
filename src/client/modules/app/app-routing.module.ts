// *****************************************************************************
// Imports
// *****************************************************************************

import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthSignInComponent } from './';
import { AuthGuardService }    from './';
import { UserListComponent }   from './';
import { UserDetailComponent } from './';
import { RoleListComponent }   from './';
import { RoleDetailComponent } from './';
import { ErrorComponent }      from '../shared';

// *****************************************************************************
// Routes
// *****************************************************************************

const appRoutes: Routes = [

  // public routes
  { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
  { path: 'sign-in', component: AuthSignInComponent },

  // private routes
  { path: '', canActivate: [AuthGuardService], children: [
    { path: 'users',     component: UserListComponent },
    { path: 'users/new', component: UserDetailComponent },
    { path: 'users/:id', component: UserDetailComponent },
    { path: 'roles',     component: RoleListComponent },
    { path: 'roles/new', component: RoleDetailComponent },
    { path: 'roles/:id', component: RoleDetailComponent },
  ] },

  // error route
  { path: '**', component: ErrorComponent }
];

// *****************************************************************************
// Module
// *****************************************************************************

@NgModule({
  imports: [ RouterModule.forRoot(appRoutes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }

// *****************************************************************************
