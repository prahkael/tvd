'use strict';
(function(){

// *****************************************************************************
// Imports
// *****************************************************************************

// *****************************************************************************
// Locals
// *****************************************************************************

const _objSettings_u = global.objSettings_u;
const localWebpackMiddleware;

// *****************************************************************************
// Functions
// *****************************************************************************

function init(app, objMiddleware) {
  
  // locals
  localWebpackMiddleware = objMiddleware.localWebpackMiddleware;
  
  // routes
  app.get('*', webpackMiddleware);
}

// *****************************************************************************

function webpackMiddleware(req, res, next) {

  // If the request is actually an API call,
  // go to the next middleware.
  if (req.url.indexOf('/api') === 0) {
    return next();
  }

  // Read the file from the "dist" folder - either
  // from the local folder or from the virtual folder
  // the webpack server created.
  res.write(localWebpackMiddleware.fileSystem.readFileSync(path.join(__dirname, '../../../dist/index.html')));
  res.end();
}


// *****************************************************************************
// Exports
// *****************************************************************************

module.exports = { init };

// *****************************************************************************

})();
