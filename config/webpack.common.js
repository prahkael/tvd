'use strict'; (function(){

// *****************************************************************************
// Includes
// *****************************************************************************

const webpack           = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const pathHelpers       = require('./helpers/path-helpers');

// *****************************************************************************
// Locals
// *****************************************************************************

const _strPathSrcClient = pathHelpers.getPath('client');

// *****************************************************************************
// Config
// *****************************************************************************

module.exports = {
  entry: {
    'polyfills': `${_strPathSrcClient}/polyfills.ts`,
    'vendor'   : `${_strPathSrcClient}/vendor.ts`,
    'app'      : `${_strPathSrcClient}/main.ts`,
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },

  module: {
    rules: [{
        test: /\.(ts|tsx)$/,
        use: [{
          loader: 'awesome-typescript-loader',
          options: { configFileName: pathHelpers.root('src', 'client', 'tsconfig.json') }
        }, 'angular2-template-loader']
      },
      {
        test: /\.html$/,
        use: 'html-loader'
      },
      {
        test: /\.(pug|jade)$/,
        use: ['raw-loader', 'pug-html-loader']
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        use: 'file-loader?name=assets/[name].[hash].[ext]'
      },
      {
        test: /\.css$/,
        exclude: pathHelpers.root('src', 'client', 'modules'),
        use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader?sourceMap' })
      },
      {
        test: /\.css$/,
        include: pathHelpers.root('src', 'client', 'modules'),
        use: 'raw-loader'
      },
      {
        test: /\.(yaml|yml)$/,
        include: pathHelpers.root('src', 'assets', 'i18n'),
        use: [ 'json-loader', 'yaml-loader' ]
      }
    ]
  },

  plugins: [
    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)@angular/,
      _strPathSrcClient,
      {}
    ),

    // new webpack.ContextReplacementPlugin(                          // Workaround for angular/angular#11580
    //   /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/, // The (\\|\/) piece accounts for path separators in *nix and Windows
    //   _strPathSrcClient,                                           // location of your src
    //   {}                                                           // a map of your routes
    // ),

    new webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'vendor', 'polyfills']
    }),

    new HtmlWebpackPlugin({
      template: `${_strPathSrcClient}/index.html`
    })
  ]
};

// *****************************************************************************

})();
