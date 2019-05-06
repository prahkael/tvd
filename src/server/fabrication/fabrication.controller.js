'use strict';
(function(){

// *****************************************************************************
// Imports
// *****************************************************************************

const fabrService = require('./fabrication.service.js');

// *****************************************************************************
// Locals
// *****************************************************************************

// *****************************************************************************
// Functions
// *****************************************************************************

function init(app) {
  app.get('/api/fabrications',         doReadFabrications);
  app.get('/api/fabrications/headers', doReadFabricationHeaders);
  app.get('/api/fabrications/filters', doReadFabricationFilters);
}

// *****************************************************************************

function doReadFabrications(req, res, next) {
  const objUserAndRole = { objUser: req.user, objRole: req.role };
  const objMeta     = { customFilters: objSettings_u.customFilters };
  const objOptions     = _readParams(Object.assign({}, req.query));

  return fabrService.readFabrications(objUserAndRole, objOptions,
      (objErr, arrActiveOperations, hasNoMoreRows) => {
    
    if (objErr) {
      console.error(objErr);
      return res.status(500).json({ data: objErr });
    }
    objMeta.hasNoMoreRows = hasNoMoreRows;

    return res.status(200).json({ data: arrActiveOperations, meta: objMeta });
  });
}

// *****************************************************************************

function doReadFabricationHeaders(req, res, next) {
  return fabrService.readFabricationHeaders((objErr, objHeaders) => {
    if (objErr) {
      console.error(objErr);
      return res.status(500).json({ data: objErr });
    }
    return res.status(200).json({ data: objHeaders, meta: null });
  });
}

// *****************************************************************************

function doReadFabricationFilters(req, res, next) {
  return fabrService.readFabricationFilters((objErr, aarFilters) => {
    if (objErr) {
      console.error(objErr);
      return res.status(500).json({ data: objErr });
    }
    return res.status(200).json({ data: aarFilters, meta: null });
  });
}

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.init                     = init;
module.exports.doReadFabrications       = doReadFabrications;
module.exports.doReadFabricationHeaders = doReadFabricationHeaders;
module.exports.doReadFabricationFilters = doReadFabricationFilters;

// *****************************************************************************
// Helpers
// *****************************************************************************

function _readParams(objQuery_u) {
  const objParams = {};

  if (objQuery_u.sort) {
    objParams.strSort = objQuery_u.sort;
    delete objQuery_u.sort;
  }
  if (objQuery_u.search) {
    objParams.strSearch = objQuery_u.search;
    delete objQuery_u.search;
  }
  if (objQuery_u.limit) {
    objParams.numLimit = +objQuery_u.limit;
    delete objQuery_u.limit;
  }
  if (objQuery_u.start) {
    objParams.numStart = +objQuery_u.start;
    delete objQuery_u.start;
  }

  const arrFilterKeys = Object.keys(objQuery_u || {});
  if (arrFilterKeys.length > 0) {
    objParams.objFilters = {};
    Object.keys(objQuery_u).forEach(strKey =>
        objParams.objFilters[strKey] = objQuery_u[strKey]);
  }

  return objParams;
}

// *****************************************************************************

})();
