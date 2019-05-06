// *****************************************************************************
// Vendor imports
// *****************************************************************************

import { NgModule }        from '@angular/core';
import { BrowserModule }   from '@angular/platform-browser';
import { FormsModule }     from '@angular/forms';
import { HttpModule }      from '@angular/http';
import { TranslateModule } from '@ngx-translate/core';

// *****************************************************************************
// Local imports
// *****************************************************************************

import { OrderRoutingModule }           from '.';
import { OrderListComponent }           from '.';
import { OrderService }                 from '.';
import { FilterOrdersByPipe }           from '.';

import { LoadingSpinnerComponent }            from '../shared';
import { LoadingSpinnerService }              from '../shared';
import { PipesModule }                        from '../shared';


// *****************************************************************************
// Module meta data
// *****************************************************************************

@NgModule({
  imports     : [
    TranslateModule.forChild(),
    OrderRoutingModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    PipesModule,
  ],
  declarations: [
    OrderListComponent,
    FilterOrdersByPipe,
  ],
  providers   : [
    OrderService,
  ],
})

// *****************************************************************************
// Module class
// *****************************************************************************

export class OrderModule {
}

// *****************************************************************************
