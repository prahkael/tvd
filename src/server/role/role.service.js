'use strict';
// *****************************************************************************
// Imports
// *****************************************************************************

const passwordHash   = require('password-hash');
const objDatabases_u = require('../loader.js');

// *****************************************************************************
// Locals
// *****************************************************************************

// *****************************************************************************
// CRUD functions
// *****************************************************************************

function createRole(objRole, callback) {
  return objDatabases_u.roles.insert(objRole, (objErr, objRole) => {
    if (objErr) {
      return callback(objErr);
    }
    if (!objRole) {
      return callback({ numStatus: 500, strMessage: 'Role not created!' });
    }

    objDatabases_u.roles.persistence.compactDatafile();
    return callback(null, objRole);
  });
}

// *****************************************************************************

function readRoles(callback) {
  return objDatabases_u.roles.find({}).sort({ name: 1 }).exec((objErr, arrRoles) => {
    if (objErr) {
      return callback(objErr);
    }
    if (!arrRoles || arrRoles.length <= 0) {
      return callback({ numStatus: 500, strMessage: 'Roles not found!' });
    }
    return callback(null, arrRoles);
  });
}

// *****************************************************************************

function readRole(strRoleID, callback) {
  return objDatabases_u.roles.findOne({ _id: strRoleID }, (objErr, objRole) => {
    if (objErr) {
      return callback(objErr);
    }
    if (!objRole) {
      return callback({ numStatus: 500, strMessage: 'Role not found!' });
    }
    return callback(null, objRole);
  });
}

// *****************************************************************************

function updateRole(strRoleID, objRole, callback) {
  if (objRole.password) {
    objRole.password = passwordHash.generate(objRole.password);
  }

  return objDatabases_u.roles.update({ _id: strRoleID }, { $set: objRole }, objErr => {
    if (objErr) {
      return callback(objErr);
    }

    objDatabases_u.roles.persistence.compactDatafile();
    objRole._id = strRoleID;

    return callback(null, objRole);
  });
}

// *****************************************************************************

function deleteRole(strRoleID, callback) {
  return objDatabases_u.roles.remove({ _id: strRoleID }, objErr => {
    if (objErr) {
      return callback(objErr);
    }

    objDatabases_u.roles.persistence.compactDatafile();
    return callback(null);
  });
}

// *****************************************************************************
// Helpers
// *****************************************************************************

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.readRole   = readRole;
module.exports.readRoles  = readRoles;
module.exports.createRole = createRole;
module.exports.updateRole = updateRole;
module.exports.deleteRole = deleteRole;

// *****************************************************************************
