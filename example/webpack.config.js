var join = require('path').join;
var reworkWebpackLoader = require('rework-webpack-loader');
var reworkVars = require('rework-vars');
var reworkCalc = require('rework-calc');
var reworkCustomMedia = require('rework-custom-media');
var varMap = reworkWebpackLoader.makeVarMap('src/index.css');

module.exports = {
  entry: './src/index',

  resolve: {
    packageMains: ['webpack', 'browser', 'web', 'style', 'main']
    // extensions: ['', '.webpack.js', '.web.js', '.es6.js', '.js'],
    // alias: {
    //   underscore: 'lodash',
    //   jquery: 'noop',
    //   debug: 'noop',
    //   promise: 'when/es6-shim/Promise.browserify-es6'
    // }
  },

  output: {
    path: join(__dirname, 'dist'),
    filename: 'index.[hash].js'
  },

  module: {
    loaders: [
      {test: /\.css$/, loader: 'style-loader!rework-webpack-loader'},
      {test: /\.((png)|(eot)|(woff)|(ttf)|(svg)|(gif))$/, loader: 'file-loader'}
    ]
  },

  rework: {
    use: [
      reworkWebpackLoader.plugins.imports,
      reworkWebpackLoader.plugins.urls,
      reworkWebpackLoader.plugins.stripLocalDefs(varMap),
      reworkCustomMedia({map: varMap}),
      reworkVars({map: varMap}),
      reworkCalc
    ]
  }
};
