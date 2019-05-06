(function(){ 'use strict';

// *****************************************************************************
// Imports
// *****************************************************************************

const databases = require('../loader.js');
const settings  = require('../../shared/settings');

// *****************************************************************************
// Locals
// *****************************************************************************

const arrOrderKeys = Array.from(new Set(
  settings.orderHeaders.primary.concat(
  settings.orderHeaders.secondary)
));

// *****************************************************************************
// Functions
// *****************************************************************************

function readOrders(objUserAndRole, objOptions, callback) {
  const isAdmin     = (objUserAndRole && objUserAndRole.role && objUserAndRole.role.isAdmin);
  const strSort     = objOptions && objOptions.strSort   || settings.orders.sortDefault;
  const numLimit    = objOptions && +objOptions.numLimit || settings.orders.limitDefault;
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
    const arrFindTmp = arrOrderKeys.map(strOrdrKey => {
      return { [strOrdrKey]: { $regex: new RegExp(`.*${strSearch}.*`, 'i') } };
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
    const arrOrdrHeadersToExclude = objUserAndRole &&
      objUserAndRole.objRole &&
      objUserAndRole.objRole.ordrHeaders || [];
    arrOrdrHeadersToExclude.forEach(strHeader => {
      objProjection[strHeader] = 0;
    });
  }

  // filter by pre-defined role filters
  if (!isAdmin) {
    let arrValues, arrValuesExtra;
    const aarOrdrHeadersAndValuesToFilter =
      objUserAndRole &&
      objUserAndRole.objRole &&
      objUserAndRole.objRole.ordrHeadersAndValues ||
      {};
    const arrOrdrHeadersAndValuesToFilterKeys = Object.keys(
      aarOrdrHeadersAndValuesToFilter);
    const objFindFilter = {
      $and: arrOrdrHeadersAndValuesToFilterKeys.map(strKey => {
        arrValuesExtra = [];
        arrValues      = aarOrdrHeadersAndValuesToFilter[strKey];
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
      .orders
      .find(objFind)
      .sort(objSort)
      .projection(objProjection)
      .exec((objErr, arrOrders) => {

    if (objErr) {
      console.error(objErr);
      return callback(objErr);
    }

    // ensure result is an array
    arrOrders = arrOrders || [];

    // test if more results can be loaded
    if (numStart >= 0 && numLimit > 0 && (numStart + numLimit) >= arrOrders.length) {
      hasNoMoreRows = true;
    }

    // limit result manually by limit and start
    if (numStart >= 0 && numLimit > 0 && arrOrders.length > (numStart + numLimit)) {
      arrOrders = arrOrders.splice(numStart, numLimit);
    }

    return callback(null, arrOrders || [], hasNoMoreRows);
  });
}

// *****************************************************************************

function readOrderHeaders(callback) {
  const objHeaders = Object.assign({}, settings.orderHeaders, {
    all: arrOrderKeys
  });
  return callback(null, objHeaders);
}

// *****************************************************************************

function readOrderFilters(callback) {
  const objProjection = {};
  const aarFilters    = {};
  let strValue;

  settings.orderFilters.forEach(strFilter => objProjection[strFilter] = 1);

  return databases
      .orders
      .find({})
      .projection(objProjection)
      .exec((objErr, arrFilters) => {

    if (objErr) {
      console.error(objErr);
      return callback(objErr);
    }

    settings.orderFilters.forEach(strFilter => {
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

module.exports.readOrders       = readOrders;
module.exports.readOrderHeaders = readOrderHeaders;
module.exports.readOrderFilters = readOrderFilters;

// *****************************************************************************

})();
