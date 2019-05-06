'use strict';
(function(){

// *****************************************************************************
// Includes
// *****************************************************************************

const webpackMerge      = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const commonConfig      = require('./webpack.common.js');
const pathHelpers       = require('./helpers/path-helpers');

// *****************************************************************************
// Config for development
// *****************************************************************************

module.exports = webpackMerge(commonConfig, {
  devtool: 'cheap-module-eval-source-map',

  output: {
    path         : pathHelpers.root('dist'),
    filename     : '[name].js',
    chunkFilename: '[id].chunk.js'
  },

  plugins: [
    new ExtractTextPlugin('[name].css')
  ],

  devServer: {
    historyApiFallback: true,
    stats: 'minimal'
  }
});

// *****************************************************************************

})();
