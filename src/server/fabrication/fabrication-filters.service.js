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

function filterByFabrHeaders(objUserAndRole, arrActiveOps) {
  const arrFabrHeadersToExclude = objUserAndRole &&
      objUserAndRole.objRole &&
      objUserAndRole.objRole.arrFabrHeaders;

  if (!arrActiveOps ||
      !arrFabrHeadersToExclude ||
      arrActiveOps.length <= 0 ||
      arrFabrHeadersToExclude.length <= 0) {
    return arrActiveOps;
  }

  arrActiveOps.forEach(objActiveOps => {
    arrFabrHeadersToExclude.forEach(strHeader =>
      delete objActiveOps[strHeader]);
  });

  return arrActiveOps;
}

// *****************************************************************************

function filterByFabrHeadersAndValues(objUserAndRole, arrActiveOps) {
  const arrActiveOpsReturn              = [];
  const aarFabrHeadersAndValuesToFilter =
      objUserAndRole &&
      objUserAndRole.objRole &&
      objUserAndRole.objRole.aarFabrHeadersAndValues ||
      {};
  const arrKeysFabrHeadersAndValuesToFilter =
      Object.keys(aarFabrHeadersAndValuesToFilter);
  let arrActiveOpsKeys, arrValues, numIndex, isFilterEmpty;

  if (!arrActiveOps ||
      arrActiveOps.length <= 0 ||
      arrKeysFabrHeadersAndValuesToFilter.length <= 0) {
    return arrActiveOps;
  }

  arrActiveOps.forEach((objActiveOps, numIndexActiveOps) => {
    arrActiveOpsKeys = Object.keys(objActiveOps);
    arrKeysFabrHeadersAndValuesToFilter.forEach(strFabrHeader => {
      numIndex = arrActiveOpsKeys.indexOf(strFabrHeader);
      if (numIndex < 0) {
        return;
      }

      arrValues     = aarFabrHeadersAndValuesToFilter[strFabrHeader];
      isFilterEmpty = arrValues.filter(strValue => {
        return (
          ((objActiveOps[strFabrHeader])+'').trim().toLowerCase() ===
          (strValue+'').trim().toLowerCase()
        );
      }).length <= 0;

      if (!isFilterEmpty) {
        arrActiveOpsReturn.push(objActiveOps);
      }
    });
  });

  return arrActiveOpsReturn;
}

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.filterByFabrHeaders          = filterByFabrHeaders;
module.exports.filterByFabrHeadersAndValues = filterByFabrHeadersAndValues;

// *****************************************************************************

})();
