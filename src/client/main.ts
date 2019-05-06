// *****************************************************************************
// Imports
// *****************************************************************************

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode }         from '@angular/core';
import { AppModule }              from './modules/app/app.module';

// *****************************************************************************
// Initialization
// *****************************************************************************

if (process.env.ENV === 'production') {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);

// *****************************************************************************
