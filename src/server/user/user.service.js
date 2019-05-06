(function() { 'use strict';

// *****************************************************************************
// Imports
// *****************************************************************************

const passwordHash = require('password-hash');
const objDatabases_u = require('../loader.js');

// *****************************************************************************
// Functions
// *****************************************************************************

function readUsers(callback) {
  return objDatabases_u.users.find({}).sort({ username: 1 }).exec((objErr, arrUsers) => {
    if (objErr) {
      return callback(objErr);
    }
    if (!arrUsers || arrUsers.length <= 0) {
      return callback({ numStatus: 500, strMessage: 'Users not found!' });
    }
    return callback(null, _removePasswords(arrUsers));
  });
}

// *****************************************************************************

function readUser(strUserID, callback) {
  return objDatabases_u.users.findOne({ _id: strUserID }, (objErr, objUser) => {
    if (objErr) {
      return callback(objErr);
    }
    if (!objUser) {
      return callback({ numStatus: 500, strMessage: 'User not found!' });
    }
    return callback(null, _removePassword(objUser));
  });
}

// *****************************************************************************

function createUser(objUser, callback) {
  objUser.password = passwordHash.generate(objUser.password);
  return objDatabases_u.users.insert(objUser, (objErr, objUser) => {
    if (objErr) {
      return callback(objErr);
    }
    if (!objUser) {
      return callback({ numStatus: 500, strMessage: 'User not created!' });
    }

    objDatabases_u.users.persistence.compactDatafile();
    return callback(null, _removePassword(objUser));
  });
}

// *****************************************************************************

function updateUser(objUser, callback) {
  let userId = objUser._id;
  delete objUser._id;

  if (objUser.password) {
    objUser.password = passwordHash.generate(objUser.password);
  }

  return objDatabases_u.users.update({ _id: userId }, { $set: objUser }, objErr => {
    if (objErr) {
      return callback(objErr);
    }

    objDatabases_u.users.persistence.compactDatafile();
    objUser._id = userId;

    return callback(null, _removePassword(objUser));
  });
}

// *****************************************************************************

function deleteUser(strUserID, callback) {
  return objDatabases_u.users.remove({ _id: strUserID }, objErr => {
    if (objErr) {
      return callback(objErr);
    }

    objDatabases_u.users.persistence.compactDatafile();
    return callback(null);
  });
}

// *****************************************************************************
// Helpers
// *****************************************************************************

function _removePassword(objUser) {
  if (objUser.password) {
    delete objUser.password;
  }
  return objUser;
}

// *****************************************************************************

function _removePasswords(arrUsers) {
  let arrUsersClean = [];
  arrUsers.forEach(objUser => {
    arrUsersClean.push(_removePassword(objUser));
  });
  return arrUsersClean;
}

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports = { readUser, readUsers, createUser, updateUser, deleteUser };

// *****************************************************************************

})();
