// *****************************************************************************
// Imports
// *****************************************************************************

import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';
import { Routes }       from '@angular/router';

import { OrderListComponent } from '.';
import { AuthGuardService }         from '../app';

// *****************************************************************************
// Routes
// *****************************************************************************

const orderRoutes: Routes = [
  { path: 'orders', canActivate: [AuthGuardService], component: OrderListComponent },
];

// *****************************************************************************
// Module
// *****************************************************************************

@NgModule({
  imports: [ RouterModule.forChild(orderRoutes) ],
  exports: [ RouterModule ]
})
export class OrderRoutingModule { }

// *****************************************************************************
