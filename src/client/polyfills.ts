'use strict';

// *****************************************************************************
// Imports
// *****************************************************************************

import 'core-js/es6';
import 'core-js/es7/reflect';

require('zone.js/dist/zone');

// *****************************************************************************
// Environment
// *****************************************************************************

// Production
if (process.env.ENV === 'production') {
}

// Development and test
else {
  Error['stackTraceLimit'] = Infinity;
  require('zone.js/dist/long-stack-trace-zone');
}

// *****************************************************************************
