// *****************************************************************************
// Imports
// *****************************************************************************

import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';
import { Routes }       from '@angular/router';

import { FabricationListComponent } from './';
import { AuthGuardService }         from '../app';

// *****************************************************************************
// Routes
// *****************************************************************************

const fabricationRoutes: Routes = [
  { path: 'fabrications', canActivate: [AuthGuardService], component: FabricationListComponent },
];

// *****************************************************************************
// Module
// *****************************************************************************

@NgModule({
  imports: [ RouterModule.forChild(fabricationRoutes) ],
  exports: [ RouterModule ]
})
export class FabricationRoutingModule { }

// *****************************************************************************
