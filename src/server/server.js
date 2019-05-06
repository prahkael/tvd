(function() { 'use strict';

// *****************************************************************************
// Imports
// *****************************************************************************

const fs                   = require('fs');
const path                 = require('path');
const yaml                 = require('js-yaml');
const express              = require('express');
const methodOverride       = require('method-override');
const bodyParser           = require('body-parser');
const webpack              = require('webpack');
const webpackMiddleware    = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

// load settings
// global.objSettings_u = yaml.safeLoad(fs.readFileSync(path.join(__dirname, '../shared/settings.yaml')));
global.objSettings_u = require('../shared/settings.js');

// load middleware and controllers
const authMiddleware        = require('./auth/auth.middleware.js');
const authController        = require('./auth/auth.controller.js');
const userController        = require('./user/user.controller.js');
const roleController        = require('./role/role.controller.js');
const fabricationController = require('./fabrication/fabrication.controller.js');
const fabrMetaController    = require('./fabrication/fabrication-meta.controller.js');
const orderController       = require('./order/order.controller.js');

// *****************************************************************************
// Definitions
// *****************************************************************************

const isDevelopment    = process.env.NODE_ENV !== 'production';
const strWebpackConfig = isDevelopment ? 'dev' : 'prod';
const strHost          = '0.0.0.0';
const numPort          = isDevelopment ? 8080 : 8080;
const app              = express();
const webpackConfig    = require(`../../config/webpack.${strWebpackConfig}.config.js`);

// *****************************************************************************
// Locals
// *****************************************************************************

const webpackCompiler        = webpack(webpackConfig);
const localWebpackMiddleware = webpackMiddleware(webpackCompiler, {
  publicPath : webpackConfig.output.publicPath,
  contentBase: './src/client',
  stats      : {
    colors      : true,
    hash        : false,
    timings     : true,
    chunks      : false,
    chunkModules: false,
    modules     : false,
  }
});

// *****************************************************************************
// Config
// *****************************************************************************

// static folder
app.use(express.static(__dirname + '/dist'));

// body JSON parser
app.use(bodyParser.json());

// method override for PUT, PATCH and DELETE
app.use(methodOverride('X-HTTP-Method-Override'));

// local webpack middleware
app.use(localWebpackMiddleware);

// webpack hot reload middleware
app.use(webpackHotMiddleware(webpackCompiler));

// authentication middleware token extraction
app.use(authMiddleware.doExtractToken);

// webpack file entry point for memory parsing
app.get('*', _webpackMiddleware);

// *****************************************************************************
// Public routes
// *****************************************************************************

// public auth routes
authController.init(app);

// *****************************************************************************
// Private routes
// *****************************************************************************

// authentication and authorization
app.use(authMiddleware.doAuthenticate);
app.use(authMiddleware.doAuthorize);

// controllers for the API
userController.init(app);
roleController.init(app);
fabricationController.init(app);
app.use('/api', fabrMetaController);
orderController.init(app);

// *****************************************************************************
// Error
// *****************************************************************************

app.use((objErr, req, res, next) => {
  console.log('An error happened:');
  console.error(objErr);

  if (objErr.numStatus || objErr.status) {
    res.status(objErr.numStatus || objErr.status);
  }

  return res.json({ err: objErr });
});

// *****************************************************************************
// Server
// *****************************************************************************

app.listen(numPort, strHost, function onStart(objErr) {
  if (objErr) {
    console.log(objErr);
  }
  console.info(`🌎 Listening on port ${numPort}. Open up http://${strHost}:${numPort}/ in your browser.`);
});

// *****************************************************************************
// Helpers
// *****************************************************************************

// Public route to return the index
// file including Angular.
function _webpackMiddleware(req, res, next) {

  // If the request is actually an API call,
  // go to the next middleware.
  if (req.url.indexOf('/api') === 0) {
    return next();
  }

  // Read the file from the "dist" folder - either
  // from the local folder or from the virtual folder
  // the webpack server created.
  res.write(localWebpackMiddleware.fileSystem.readFileSync(path.join(__dirname, '../../dist/index.html')));
  res.end();
}

// *****************************************************************************


})();
