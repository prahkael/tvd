// *****************************************************************************
// Vendor imports
// *****************************************************************************

import { NgModule }        from '@angular/core';
import { Router }          from '@angular/router';
import { BrowserModule }   from '@angular/platform-browser';
import { FormsModule }     from '@angular/forms';
import { HttpModule }      from '@angular/http';
import { TranslateModule } from '@ngx-translate/core';

// *****************************************************************************
// Local imports
// *****************************************************************************

import { ClipboardModule }         from 'ngx-clipboard';
import { FabricationModule }       from '../fabrication';
import { OrderModule }             from '../order';

import { AppRoutingModule }        from './';
import { AppComponent }            from './';
import { NavbarComponent }         from './';
import { AuthSignInComponent }     from './';
import { AuthService }             from './';
import { AuthGuardService }        from './';
import { UserService }             from './';
import { UserListComponent }       from './';
import { UserDetailComponent }     from './';
import { RoleService }             from './';
import { RoleListComponent }       from './';
import { RoleDetailComponent }     from './';
import { HttpProvider }            from './';
import { LoadingSpinnerComponent } from '../shared';
import { LoadingSpinnerService }   from '../shared';
import { ErrorComponent }          from '../shared';
import { LocalVariableDirective }  from '../shared';

const settings = require('json-loader!yaml-loader!../../../shared/settings.yaml');

// *****************************************************************************
// Module meta data
// *****************************************************************************

@NgModule({
  imports     : [
    TranslateModule.forRoot(),
    FabricationModule,
    OrderModule,
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    ClipboardModule,
  ],
  declarations: [
    AppComponent,
    AuthSignInComponent,
    UserListComponent,
    UserDetailComponent,
    RoleListComponent,
    RoleDetailComponent,
    NavbarComponent,
    LoadingSpinnerComponent,
    ErrorComponent,
    LocalVariableDirective,
  ],
  providers   : [
    HttpProvider,
    AuthService,
    AuthGuardService,
    UserService,
    RoleService,
    LoadingSpinnerService,
    { provide: 'OMP_SETTINGS', useValue: settings },
  ],
  bootstrap   : [AppComponent]
})

// *****************************************************************************
// Module class
// *****************************************************************************

export class AppModule {
  // Diagnostic only: inspect router configuration
  constructor(router: Router) {
    // console.log('Routes: ', JSON.stringify(router.config, undefined, 2));
  }
}

// *****************************************************************************
