'use strict';

// *****************************************************************************
// Imports
// *****************************************************************************

const userService = require('./user.service.js');
const roleService = require('../role/role.service.js');
const authService = require('../auth/auth.service.js');

// *****************************************************************************
// CRUD functions
// *****************************************************************************

function init(app) {
  
  // Misc routes
  app.get('/api/users/meta',   doReadUserMeta);
  
  // CRUD routes
  app.get('/api/users',        doReadUsers);
  app.get('/api/users/:id',    doReadUser);
  app.post('/api/users',       doCreateUser);
  app.put('/api/users/:id',    doUpdateUser);
  app.delete('/api/users/:id', doDeleteUser);
}

// *****************************************************************************

function doReadUsers(req, res, next) {
  return userService.readUsers((objErr, arrUsers) => {
    if (objErr) {
      return next(objErr);
    }
    return res.status(200).json({ data: arrUsers });
  });
}

// *****************************************************************************

function doReadUser(req, res, next) {
  if (!req.params.id) {
    throw new Error('User id not in request params!');
  }

  return userService.readUser(req.params.id, (objErr, objUser) => {
    if (objErr) {
      return next(objErr);
    }
    return res.status(200).json({ data: objUser });
  });
}

// *****************************************************************************

function doCreateUser(req, res, next) {
  if (!req.body.user) {
    throw new Error('User to create not in request body!');
  }

  return userService.createUser(req.body.user, (objErr, objUser) => {
    if (objErr) {
      return next(objErr);
    }
    return res.status(200).json({ data: objUser });
  });
}

// *****************************************************************************

function doUpdateUser(req, res, next) {
  if (!req.body.user) {
    throw new Error('User to update not in request body!');
  }

  return userService.updateUser(req.body.user, (objErr, objUser) => {
    if (objErr) {
      return next(objErr);
    }
    return res.status(200).json({ data: objUser });
  });
}

// *****************************************************************************

function doDeleteUser(req, res, next) {
  if (!req.params.id) {
    throw new Error('User id not in request params!');
  }

  return userService.deleteUser(req.params.id, objErr => {
    if (objErr) {
      return next(objErr);
    }
    return res.status(200).json({ success: true });
  });
}

// *****************************************************************************
// Misc functions
// *****************************************************************************

function doReadUserMeta(req, res, next) {
  return roleService.readRoles((objErr, arrRoles) => {
    if (objErr) {
      return next(objErr);
    }
    return res.status(200).json({ data: { roles: arrRoles } });
  });
}

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports = { init };

// *****************************************************************************
