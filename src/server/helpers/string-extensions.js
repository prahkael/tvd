// *****************************************************************************
// Imports
// *****************************************************************************

// const safe = require('safe-regex'); // Use or remove!

// *****************************************************************************
// Extensions
// *****************************************************************************

String.prototype['toCapitalCase']   = toCapitalCase;
String.prototype['toUncapitalCase'] = toUncapitalCase;
String.prototype['toCamelCase']     = toCamelCase;
String.prototype['toConstantCase']  = toConstantCase;
String.prototype['toDashCase']      = toDashCase;
String.prototype['toPascalCase']    = toPascalCase;
String.prototype['toSnakeCase']     = toSnakeCase;
String.prototype['toSpaceCase']     = toSpaceCase;
String.prototype['innerTrim']       = innerTrim;
String.prototype['capitalize']      = toCapitalCase;

// *****************************************************************************
// Functions
// *****************************************************************************

function toLowerCase(str) {
  str = (str || this).trim();

  if (!str || !str.toLowerCase) {
    return '';
  }

  return str.toLowerCase();
}

// *****************************************************************************

function toUpperCase(str) {
  str = (str || this).trim();

  if (!str || !str.toUpperCase) {
    return '';
  }

  return str.toUpperCase();
}

// *****************************************************************************

function toCapitalCase(str) {
  str = (str || this).trim();

  if (!str || !str[0]) {
    return '';
  }

  return str[0].toUpperCase() + str.substr(1);
}

// *****************************************************************************

function toUncapitalCase(str) {
  str = (str || this).trim();

  if (!str || !str[0]) {
    return '';
  }

  return str[0].toLowerCase() + str.substr(1);
}

// *****************************************************************************

function toCamelCase(str) {
  str = (str || this).trim();

  const regexMatch1 = /[A-Z0-9ÄÖÜ_]+/;
  const regexMatch2 = /([\s\-_]|\b)[\wäöüÄÖÜß]/g;
  const regexMatch3 = /\s+/g;

  if (regexMatch1 && regexMatch1[0] && regexMatch1[0].length === str.length) {
    str = str.toLowerCase();
  }

  return (str
      .replace(regexMatch2, ($0, $1, pos) =>
          (pos === 0 ? $0.toLowerCase() : $0.replace($1, '').toUpperCase()))
      .replace(regexMatch3, '')
  );
}

// *****************************************************************************

function toConstantCase(str) {
  str = (str || this).trim();
  return (str.toSnakeCase().toUpperCase());
}

// *****************************************************************************

function toDashCase(str) {
  str = (str || this).trim();
  return str.toSnakeCase().replace(/_/g, '-');
}

// *****************************************************************************

function toPascalCase(str) {
  str = (str || this).trim();
  return (str.toCamelCase().capitalize());
}

// *****************************************************************************

function toSnakeCase(str) {
  str = (str || this).trim();

  const regexMatch1 = /\ /g;
  const regexMatch2 = /[a-zäöüß][A-Zäöü]/g;
  const regexMatch3 = /[\-]+/g;

  return (str
    .replace(regexMatch1, '_')
    .replace(regexMatch2, $0 => $0[0] + '_' + $0[1])
    .replace(regexMatch3, '_')
    .toLowerCase()
  );
}

// *****************************************************************************

function toSpaceCase(str) {
  str = (str || this).trim();
  const regexMatch = /\_/g;
  return str.toSnakeCase().replace(regexMatch, ' ').toLowerCase();
}

// *****************************************************************************

function innerTrim(str) {
  str = (str || this).trim();
  const regexMatch = /\s+/g;
  return str.replace(regexMatch, '');
}

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.toLowerCase     = toLowerCase;
module.exports.toUpperCase     = toUpperCase;
module.exports.toCapitalCase   = toCapitalCase;
module.exports.toUncapitalCase = toUncapitalCase;
module.exports.toCamelCase     = toCamelCase;
module.exports.toConstantCase  = toConstantCase;
module.exports.toDashCase      = toDashCase;
module.exports.toPascalCase    = toPascalCase;
module.exports.toSnakeCase     = toSnakeCase;
module.exports.toSpaceCase     = toSpaceCase;
module.exports.innerTrim       = innerTrim;
module.exports.capitalize      = toCapitalCase;

// *****************************************************************************
