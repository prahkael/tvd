(function(){ 'use strict';

// *****************************************************************************
// Imports
// *****************************************************************************

// *****************************************************************************
// Locals
// *****************************************************************************

// *****************************************************************************
// Functions
// *****************************************************************************

function filterByOrdrHeaders(objUserAndRole, arrOrders) {
  const arrOrdrHeadersToExclude = objUserAndRole &&
      objUserAndRole.objRole &&
      objUserAndRole.objRole.arrOrdrHeaders;

  if (!arrOrders ||
      !arrOrdrHeadersToExclude ||
      arrOrders.length <= 0 ||
      arrOrdrHeadersToExclude.length <= 0) {
    return arrOrders;
  }

  arrOrders.forEach(objOrders => {
    arrOrdrHeadersToExclude.forEach(strHeader =>
      delete objOrders[strHeader]);
  });

  return arrOrders;
}

// *****************************************************************************

function filterByOrdrHeadersAndValues(objUserAndRole, arrOrders) {
  const arrOrdersReturn              = [];
  const aarOrdrHeadersAndValuesToFilter =
      objUserAndRole &&
      objUserAndRole.objRole &&
      objUserAndRole.objRole.aarOrdrHeadersAndValues ||
      {};
  const arrKeysOrdrHeadersAndValuesToFilter =
      Object.keys(aarOrdrHeadersAndValuesToFilter);
  let arrOrdersKeys, arrValues, numIndex, isFilterEmpty;

  if (!arrOrders ||
      arrOrders.length <= 0 ||
      arrKeysOrdrHeadersAndValuesToFilter.length <= 0) {
    return arrOrders;
  }

  arrOrders.forEach((objOrders, numIndexOrders) => {
    arrOrdersKeys = Object.keys(objOrders);
    arrKeysOrdrHeadersAndValuesToFilter.forEach(strOrdrHeader => {
      numIndex = arrOrdersKeys.indexOf(strOrdrHeader);
      if (numIndex < 0) {
        return;
      }

      arrValues     = aarOrdrHeadersAndValuesToFilter[strOrdrHeader];
      isFilterEmpty = arrValues.filter(strValue => {
        return (
          ((objOrders[strOrdrHeader])+'').trim().toLowerCase() ===
          (strValue+'').trim().toLowerCase()
        );
      }).length <= 0;

      if (!isFilterEmpty) {
        arrOrdersReturn.push(objOrders);
      }
    });
  });

  return arrOrdersReturn;
}

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.filterByOrdrHeaders          = filterByOrdrHeaders;
module.exports.filterByOrdrHeadersAndValues = filterByOrdrHeadersAndValues;

// *****************************************************************************

})();
