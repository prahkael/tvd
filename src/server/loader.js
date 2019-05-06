(function(){ 'use strict';

// *****************************************************************************
// Imports
// *****************************************************************************

const fs        = require('fs');
const path      = require('path');
const DataStore = require('nedb');

require('./helpers/string-extensions.js');

// *****************************************************************************
// Locals
// *****************************************************************************

const databaseNames = [
  'users',
  'roles',
  'fabrications',
  'fabrications-meta',
  'orders',
  'orders-meta',
];

// *****************************************************************************
// Functions
// *****************************************************************************

function loadDatabases() {
  const databases = databaseNames.reduce((dbs, name) => {
    dbs[name.toCamelCase()] = new DataStore(path.join(__dirname, '../data/' + name + '.db'));
    dbs[name.toCamelCase()].loadDatabase();
    return dbs;
  }, {});

  return databases;
}

// *****************************************************************************
// Helpers
// *****************************************************************************

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports = loadDatabases();

// *****************************************************************************

})();