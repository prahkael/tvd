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

import { FabricationRoutingModule }           from './';
import { FabricationListComponent }           from './';
import { FabricationService }                 from './';
import { FilterFabricationsByPipe }           from './';

import { LoadingSpinnerComponent }            from '../shared';
import { LoadingSpinnerService }              from '../shared';
import { PipesModule }                        from '../shared';

// *****************************************************************************
// Module meta data
// *****************************************************************************

@NgModule({
  imports     : [
    TranslateModule.forChild(),
    FabricationRoutingModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    PipesModule,
  ],
  declarations: [
    FabricationListComponent,
    FilterFabricationsByPipe,
  ],
  providers   : [
    FabricationService,
  ],
})

// *****************************************************************************
// Module class
// *****************************************************************************

export class FabricationModule {
}

// *****************************************************************************
