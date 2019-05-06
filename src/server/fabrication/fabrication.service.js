(function(){ 'use strict';

// *****************************************************************************
// Imports
// *****************************************************************************

const databases = require('../loader.js');
const settings  = require('../../shared/settings');

// *****************************************************************************
// Locals
// *****************************************************************************

const arrFabricationKeys = Array.from(new Set(
  settings.fabricationHeaders.primary.concat(
  settings.fabricationHeaders.secondary)
));

// *****************************************************************************
// Functions
// *****************************************************************************

function readFabrications(objUserAndRole, objOptions, callback) {
  const isAdmin     = (objUserAndRole && objUserAndRole.role && objUserAndRole.role.isAdmin);
  const strSort     = objOptions && objOptions.strSort   || settings.fabrications.sortDefault;
  const numLimit    = objOptions && +objOptions.numLimit || settings.fabrications.limitDefault;
  const numStart    = objOptions && +objOptions.numStart || 0;
  const strSearch   = objOptions.strSearch && objOptions.strSearch.trim();
  let objFind       = {};
  let objSort       = {};
  let objProjection = {};
  let hasNoMoreRows = false;

  // filter the result by precise filters
  if (objOptions.objFilters) {
    objFind = objOptions.objFilters;
  }

  // filter the result by a search query
  if (strSearch) {
    const arrFindTmp = arrFabricationKeys.map(strFabrKey => {
      return { [strFabrKey]: { $regex: new RegExp(`.*${strSearch}.*`, 'i') } };
    });
    objFind = { $and: [objFind, { $or: arrFindTmp }] };
  }

  // sort the result
  if (strSort) {
    const numFlow = strSort.indexOf('-') === 0 ? -1 : 1;
    objSort[strSort.replace(/^-/, '')] = numFlow;
  }

  // filter away excluded headers
  if (!isAdmin) {
    const arrFabrHeadersToExclude = objUserAndRole &&
      objUserAndRole.objRole &&
      objUserAndRole.objRole.fabrHeaders || [];
    arrFabrHeadersToExclude.forEach(strHeader => {
      objProjection[strHeader] = 0;
    });
  }

  // filter by pre-defined role filters
  if (!isAdmin) {
    let arrValues, arrValuesExtra;
    const aarFabrHeadersAndValuesToFilter =
      objUserAndRole &&
      objUserAndRole.objRole &&
      objUserAndRole.objRole.fabrHeadersAndValues ||
      {};
    const arrFabrHeadersAndValuesToFilterKeys = Object.keys(
      aarFabrHeadersAndValuesToFilter);
    const objFindFilter = {
      $and: arrFabrHeadersAndValuesToFilterKeys.map(strKey => {
        arrValuesExtra = [];
        arrValues      = aarFabrHeadersAndValuesToFilter[strKey];
        arrValues.forEach(strValue => arrValuesExtra.push.apply(arrValuesExtra, strValue.split('|')));
        arrValues = arrValues.concat(arrValuesExtra);
        arrValues = Array.from(new Set(arrValues));
        return { [strKey]: { $in: arrValues } };
      })
    };
    if (objFind.$and) {
      objFindFilter.$and.push.apply(objFindFilter.$and, objFind.$and);
    } else if (objFind) {
      objFindFilter.$and.push(objFind);
    }
    objFind = objFindFilter;
  }

  databases
      .fabrications
      .find(objFind)
      .sort(objSort)
      .projection(objProjection)
      .exec((objErr, arrFabrications) => {

    if (objErr) {
      console.error(objErr);
      return callback(objErr);
    }

    // ensure result is an array
    arrFabrications = arrFabrications || [];

    // test if more results can be loaded
    if (numStart >= 0 && numLimit > 0 && (numStart + numLimit) >= arrFabrications.length) {
      hasNoMoreRows = true;
    }

    // limit result manually by limit and start
    if (numStart >= 0 && numLimit > 0 && arrFabrications.length > (numStart + numLimit)) {
      arrFabrications = arrFabrications.splice(numStart, numLimit);
    }

    return callback(null, arrFabrications || [], hasNoMoreRows);
  });
}

// *****************************************************************************

function readFabricationHeaders(callback) {
  const objHeaders = Object.assign({}, settings.fabricationHeaders, {
    all: arrFabricationKeys
  });
  return callback(null, objHeaders);
}

// *****************************************************************************

function readFabricationFilters(callback) {
  const objProjection = {};
  const aarFilters    = {};
  let strValue;

  settings.fabricationFilters.forEach(strFilter => objProjection[strFilter] = 1);

  return databases
      .fabrications
      .find({})
      .projection(objProjection)
      .exec((objErr, arrFilters) => {

    if (objErr) {
      console.error(objErr);
      return callback(objErr);
    }

    settings.fabricationFilters.forEach(strFilter => {
      arrFilters.forEach(objFilter => {
        strValue = objFilter[strFilter];
        if (!aarFilters[strFilter]) {
          aarFilters[strFilter] = [];
        }
        if (strValue && strFilter && aarFilters[strFilter].indexOf(strValue) < 0) {
          aarFilters[strFilter].push(strValue);
        }
      });
    });

    return callback(null, aarFilters || []);
  });
}

// *****************************************************************************
// Helpers
// *****************************************************************************

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.readFabrications       = readFabrications;
module.exports.readFabricationHeaders = readFabricationHeaders;
module.exports.readFabricationFilters = readFabricationFilters;

// *****************************************************************************

})();
