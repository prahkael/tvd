'use strict';
(function(){
  
// *****************************************************************************
// Includes
// *****************************************************************************

var path = require('path');

// *****************************************************************************
// Locals
// *****************************************************************************

var _strPathRoot      = path.join(__dirname, '../..');
var _strPathSrc       = path.join(__dirname, '../../src');
var _strPathSrcClient = path.join(__dirname, '../../src/client');
var _strPathSrcServer = path.join(__dirname, '../../src/server');
var _strPathSrcShared = path.join(__dirname, '../../src/shared');
var _strPathSrcAssets = path.join(__dirname, '../../src/assets');

// *****************************************************************************
// Functions
// *****************************************************************************

function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [_strPathRoot].concat(args));
}

// *****************************************************************************

function getPath(strWhich) {
  switch (strWhich) {
    case 'src':
    case 'source':
      return _strPathSrc;
    case 'client':
      return _strPathSrcClient;
    case 'server':
      return _strPathSrcServer;
    case 'shared':
      return _strPathSrcShared;
    case 'assets':
      return _strPathSrcAssets;
    default:
      return _strPathRoot;
  }
}

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports.root    = root;
module.exports.getPath = getPath;

// *****************************************************************************

})();

