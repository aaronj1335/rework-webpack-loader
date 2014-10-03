# rework webpack loader

this is a [loader][] for [webpack][] that allows you to create css modules and
process them with [rework][].

it's different than [the other rework webpack loader][other] because it treats
each css file as a different webpack module.

## usage

if you're not familiar with how webpack loaders work, you should checkout [the
main documentation][loaders] first. webpack loaders allow you to transform the
source of webpack modules.

rework allows you to create modular css transformations.

`rework-webpack-loader` works in conjunction with
[`style-loader`][style-loader], but it replaces the standard
[`css-loader`][css-loader].

### installation

```text
$ npm install --save-dev rework-webpack-loader
```

### configuration

you can apply `rework-webpack-loader` to your css either explicitly in the
`require` statements:

```js
require('style!rework-webpack!./index.css');
```

or you can apply it to all css files via a configuration file:

```js
var reworkLoader = require('rework-webpack-loader');
var reworkCalc = require('rework-calc');

module.exports = {
  module: {
    loaders: [
      {test: /\.css$/, loader: 'style-loader!rework-webpack-loader'}
      // ...
    ]
  },

  // the rest of the config...

  rework: {
    use [
      reworkCalc
      // ... other rework plugins ...
    ]
  }
};
```

### advanced configuration example

`rework-webpack-loader` has to do some tricky things to get `@import`'s, url's,
and variables working correctly. so a full featured config might look like
this:

```js
var reworkLoader = require('rework-webpack-loader');
var reworkVars = require('rework-vars');
var reworkCalc = require('rework-calc');
var reworkCustomMedia = require('rework-custom-media');

// if you want to have something like a theme file that can override the css
// variables defined directly in the css file, make a variable map.
var varMap = reworkLoader.makeVarMap('src/index.css');

module.exports = {
  resolve: {
    // if you want to @import stuff you installed with npm, such as suit css,
    // you probably need to include `style` in your `packageMains` config
    packageMains: [
      'webpack',
      'browser',
      'web',
      'browserify',
      ['jam', 'main'],
      'style',
      'main'
    ]
    // ...
  },

  module: {
    loaders: [
      {test: /\.css$/, loader: 'style-loader!rework-webpack-loader'}
      // ...
    ]
  },

  // ...

  rework: {
    use: [
      reworkLoader.plugins.imports,
      reworkLoader.plugins.urls,
      reworkLoader.plugins.stripLocalDefs(varMap),
      reworkCustomMedia({map: varMap}),
      reworkVars({map: varMap}),
      reworkCalc
    ]
  }
};
```

### plugin api

the plugin api is the same as [rework's][reworkplugins], with a couple
additions:

- async plugins: if you retur a promise from a plugin, `rework-webpack-loader`
  will wait for it to complete before applying the next plugin.
- process the resulting JS: `rework-webpack-loader` works similarly to the
  default [`css-loader`][css-loader] in that it transforms css into a
  javascript webpack module that just exports a string of css. in order for
  url's in the css to resolve correctly, the plugin needs to be able to edit
  the resulting js, not just the css, so if plugins define a
  `module.exports.processJs` function, they have the opportunity to transform
  the resulting javascript. check out [the urls plugin][urlplugin] for an
  example.

[loader]: http://webpack.github.io/docs/using-loaders.html
[webpack]: http://webpack.github.io
[rework]: https://github.com/reworkcss/rework
[other]: https://github.com/okonet/rework-loader
[loaders]: http://webpack.github.io/docs/using-loaders.html
[style-loader]: https://github.com/webpack/style-loader
[css-loader]: https://github.com/webpack/css-loader
[suit]: http://suitcss.github.io
[urlplugin]: https://github.com/aaronj1335/rework-webpack-loader/blob/master/lib/plugins/urls.js
[reworkplugins]: https://github.com/reworkcss/rework#plugins
