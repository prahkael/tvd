'use strict';

// *****************************************************************************
// Imports
// *****************************************************************************

const authService = require('./auth.service.js');
const userService = require('../user/user.service.js');
const roleService = require('../role/role.service.js');

// *****************************************************************************
// Functions
// *****************************************************************************

function doExtractToken(req, res, next) {
  const strAuthHeader     = req.get('Authorization');
  const strTokenEncrypted = strAuthHeader && strAuthHeader.replace('Bearer ', '').trim();

  if (!strAuthHeader || strAuthHeader.indexOf('Bearer') < 0) {
    return next();
  }

  return authService.extractToken(strTokenEncrypted, (objErr_u, objToken) => {
    if (objToken) {
      req.token = objToken;
    }
    return next();
  });
}

// *****************************************************************************

function doAuthenticate(req, res, next) {
  const objErrNotAuthenticated = { numStatus: 401, strMessage: 'User not authenticated!' };
  const strUserID              = req.get('User-ID');

  if (!req.token || !strUserID || (req.token.userId !== strUserID)) {
    return next(objErrNotAuthenticated);
  }

  return authService.isSignedIn(req.token, (objErr_u, isSignedIn) => {
    if (isSignedIn === true) {
      return next();
    }
    return next(objErrNotAuthenticated);
  });
}

// *****************************************************************************

function doAuthorize(req, res, next) {
  const objErrNotAuthorized = { numStatus: 403, strMessage: 'User not authorized!' };
  const strUserID           = req.get('User-ID');

  return userService.readUser(strUserID, (objErr, objUser_u) => {
    if (objErr) {
      return next(objErr);
    }
    if (!objUser_u) {
      return next(objErrNotAuthorized);
    }
    req.user = objUser_u;

    return roleService.readRole(objUser_u.roleID, (objErr, objRole_u) => {
      if (objErr) {
        return next(objErr);
      }
      if (!objRole_u) {
        return next(objErrNotAuthorized);
      }
      if (objRole_u.isAdmin) {
        return next();
      }
      if (!_testResourcesSync(req.url, objRole_u.resources)) {
        return next(objErrNotAuthorized);
      }
      req.role = objRole_u;

      return next();
    });
    
  });
}

// *****************************************************************************
// Helpers
// *****************************************************************************

function _cleanURL(strURL) {
  strURL = strURL.replace(/^\/?api\//, '');
  strURL = strURL.split('/')[0];
  strURL = strURL.split('?')[0];
  strURL = strURL.trim();

  return strURL;
}

// *****************************************************************************

function _testResourcesSync(strURL, arrResources) {
  if (!arrResources || arrResources.length <= 0) {
    return false;
  }

  strURL = _cleanURL(strURL);
  return arrResources.indexOf(strURL) >= 0;
}

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.doExtractToken = doExtractToken;
module.exports.doAuthenticate = doAuthenticate;
module.exports.doAuthorize    = doAuthorize;

// *****************************************************************************
