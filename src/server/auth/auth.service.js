'use strict';
(function(){

// *****************************************************************************
// Imports
// *****************************************************************************

const fs             = require('fs');
const path           = require('path');
const jwt            = require('jsonwebtoken');
const yaml           = require('js-yaml');
const passwordHash   = require('password-hash');
const objDatabases_u = require('../loader.js');

// *****************************************************************************
// Locals
// *****************************************************************************

const _objSettings_u = global.objSettings_u;

// *****************************************************************************
// Functions
// *****************************************************************************

function extractToken(strTokenEncrypted, callback) {
  return jwt.verify(strTokenEncrypted, _objSettings_u.secret, callback);
}

// *****************************************************************************

function signIn(strAuthBase64, isRemembered, callback) {
  const objErrIncorrect = { numStatus: 401, strMessage: 'User and/or password invalid.' };
  const numTimestamp    = Math.floor(Date.now() / 1000);
  const numExpiration   = numTimestamp + (isRemembered ? _objSettings_u.expirationLong : _objSettings_u.expiration);
  const strUserData     = Buffer.from(strAuthBase64, 'base64').toString('utf8');
  const arrUserData     = strUserData.split(':');
  const strUsername     = arrUserData[0];
  const strPassword     = arrUserData[1];

  return objDatabases_u.users.findOne({ username: strUsername }, (objErr_u, objUser_u) => {
    if (objErr_u) {
      return callback(objErr_u);
    }
    if (objUser_u && objUser_u.password && passwordHash.verify(strPassword, objUser_u.password)) {
      const strToken = jwt.sign({ exp: numExpiration, userId: objUser_u._id }, _objSettings_u.secret);

      delete objUser_u.password;
      return callback(null, strToken, objUser_u, numExpiration);
    }

    return callback(objErrIncorrect);
  });
}

// *****************************************************************************

function signOut(callback) {
  return callback(null);
}

// *****************************************************************************

function isSignedIn(strToken, callback) {
  if (!strToken || !strToken.exp) {
    return callback(null, false);
  }
  
  const isSignedIn = strToken.exp - Math.floor(Date.now() / 1000) > 0;
  return callback(null, isSignedIn);
}

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports = { extractToken, signIn, signOut, isSignedIn };

// *****************************************************************************

})();
