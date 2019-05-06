'use strict';
(function(){

// *****************************************************************************
// Imports
// *****************************************************************************

const ordrService = require('./order.service.js');

// *****************************************************************************
// Locals
// *****************************************************************************

// *****************************************************************************
// Functions
// *****************************************************************************

function init(app) {
  app.get('/api/orders',         doReadOrders);
  app.get('/api/orders/headers', doReadOrderHeaders);
  app.get('/api/orders/filters', doReadOrderFilters);
}

// *****************************************************************************

function doReadOrders(req, res, next) {
  const objUserAndRole = { objUser: req.user, objRole: req.role };
  const objMeta     = { customFilters: objSettings_u.customFilters };
  const objOptions     = _readParams(Object.assign({}, req.query));

  return ordrService.readOrders(objUserAndRole, objOptions,
      (objErr, arrOrders, hasNoMoreRows) => {
    
    if (objErr) {
      console.error(objErr);
      return res.status(500).json({ data: objErr });
    }
    objMeta.hasNoMoreRows = hasNoMoreRows;

    return res.status(200).json({ data: arrOrders, meta: objMeta });
  });
}

// *****************************************************************************

function doReadOrderHeaders(req, res, next) {
  return ordrService.readOrderHeaders((objErr, objHeaders) => {
    if (objErr) {
      console.error(objErr);
      return res.status(500).json({ data: objErr });
    }
    return res.status(200).json({ data: objHeaders, meta: null });
  });
}

// *****************************************************************************

function doReadOrderFilters(req, res, next) {
  return ordrService.readOrderFilters((objErr, aarFilters) => {
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

module.exports.init               = init;
module.exports.doReadOrders       = doReadOrders;
module.exports.doReadOrderHeaders = doReadOrderHeaders;
module.exports.doReadOrderFilters = doReadOrderFilters;

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
