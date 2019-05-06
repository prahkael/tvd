'use strict';

// *****************************************************************************
// Imports
// *****************************************************************************

const roleService = require('./role.service.js');
const fabrService = require('../fabrication/fabrication.service.js');
const ordrService = require('../order/order.service.js');

// *****************************************************************************
// Locals
// *****************************************************************************

const _objSettings_u = global.objSettings_u;

// *****************************************************************************
// Functions
// *****************************************************************************

function init(app) {

  // Misc routes
  app.get('/api/roles/meta', doReadRoleMeta);

  // CRUD routes
  app.post('/api/roles', doCreateRole);
  app.get('/api/roles', doReadRoles);
  app.get('/api/roles/:id', doReadRole);
  app.put('/api/roles/:id', doUpdateRole);
  app.delete('/api/roles/:id', doDeleteRole);
}

// *****************************************************************************

function doCreateRole(req, res, next) {
  if (!req.body.data) {
    throw new Error('Role to create not in request body!');
  }

  return roleService.createRole(req.body.data, (objErr, objRole) => {
    if (objErr) {
      return next(objErr);
    }
    return res.status(200).json({ data: objRole });
  });
}

// *****************************************************************************

function doReadRoles(req, res, next) {
  return roleService.readRoles((objErr, arrRoles) => {
    if (objErr) {
      return next(objErr);
    }
    return res.status(200).json({ data: arrRoles });
  });
}

// *****************************************************************************

function doReadRole(req, res, next) {
  if (!req.params.id) {
    throw new Error('Role id not in request params!');
  }

  return roleService.readRole(req.params.id, (objErr, objRole) => {
    if (objErr) {
      return next(objErr);
    }
    return res.status(200).json({ data: objRole });
  });
}

// *****************************************************************************

function doUpdateRole(req, res, next) {
  if (!req.body.data) {
    throw new Error('Role to update not in request body!');
  }

  return roleService.updateRole(req.params.id, req.body.data, (objErr, objRole) => {
    if (objErr) {
      return next(objErr);
    }
    return res.status(200).json({ data: objRole });
  });
}

// *****************************************************************************

function doDeleteRole(req, res, next) {
  if (!req.params.id) {
    throw new Error('Role id not in request params!');
  }

  return roleService.deleteRole(req.params.id, objErr => {
    if (objErr) {
      return next(objErr);
    }
    return res.status(200).json({ success: true });
  });
}

// *****************************************************************************
// Misc functions
// *****************************************************************************
  
function doReadRoleMeta(req, res, next) {
  return res.status(200).json({ data: {
    resources           : _objSettings_u.resources,
    fabrHeaders         : Array.from(new Set(
      _objSettings_u.fabricationHeaders.primary.concat(
      _objSettings_u.fabricationHeaders.secondary)
    )),
    ordrHeaders         : Array.from(new Set(
      _objSettings_u.orderHeaders.primary.concat(
      _objSettings_u.orderHeaders.secondary)
    )),
    // fabrHeadersPrimary  : _objSettings_u.fabricationHeaders.primary,
    // fabrHeadersSecondary: _objSettings_u.fabricationHeaders.secondary,
  } });
}

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports = { init };

// *****************************************************************************
