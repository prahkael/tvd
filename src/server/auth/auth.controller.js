'use strict';
(function(){

// *****************************************************************************
// Imports
// *****************************************************************************

const authService = require('./auth.service.js');
const roleService = require('../role/role.service.js');

// *****************************************************************************
// Locals
// *****************************************************************************

const _objSettings_u = global.objSettings_u;

// *****************************************************************************
// Functions
// *****************************************************************************

function init(app) {
  app.get('/api/sign-in', doSignIn);
  app.get('/api/sign-out', doSignOut);
  app.get('/api/is-signed-in', isSignedIn);
}

// *****************************************************************************

function doSignIn(req, res, next) {
  const strAuthHeader = req.get('Authorization');
  const strAuthBase64 = strAuthHeader.replace('Basic ', '').trim();
  const isRemembered  = req.query.isRemembered;

  return authService.signIn(strAuthBase64, isRemembered, (objErr, strToken, objUser_u, numExpiration) => {
    if (objErr) {
      return next(objErr);
    }
    
    const numUserId = objUser_u._id;
    return roleService.readRole(objUser_u.roleID, (objErr, objRole) => {
      if (objErr) {
        return next(objErr);
      }
      return res.status(200).json({ data: {
        token     : strToken,
        userId    : numUserId,
        expiration: numExpiration,
        role      : objRole,
      } });
    });
  });
}

// *****************************************************************************

function doSignOut(req, res, next) {}

// *****************************************************************************

function isSignedIn(req, res, next) {
  return authService.isSignedIn(req.token, (objErr, isSignedIn) => {
    if (objErr) {
      return next(objErr);
    }
    if (isSignedIn) {
      return res.status(200).json({ data: { isSignedIn: true } });
    }

    return res.status(401).json({ data: { isSignedIn: false } });
  });
}

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports = { init };

// *****************************************************************************

})();
