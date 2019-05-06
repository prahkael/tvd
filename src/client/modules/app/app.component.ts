// *****************************************************************************
// Imports
// *****************************************************************************

import { Component }        from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import '../../../assets/styles/styles.css';

// *****************************************************************************
// Locals
// *****************************************************************************

const objTranslationsDE: any = require('../../../assets/i18n/de-DE.yaml');
const objTranslationsTR: any = require('../../../assets/i18n/tr-TR.yaml');

// *****************************************************************************
// Component
// *****************************************************************************

@Component({
  selector: 'dl-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(
    private _translateService: TranslateService
  ) {
    
    // set the translation object initially
    _translateService.setTranslation('de', objTranslationsDE);
    _translateService.setTranslation('tr', objTranslationsTR);
  
    // this language will be used as a fallback when a translation isn't found in the current language
    _translateService.setDefaultLang('de');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    _translateService.use('de');
  }
}

// *****************************************************************************
