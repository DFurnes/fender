# Fender [![NPM](https://img.shields.io/npm/v/fender.svg)](https://www.npmjs.com/package/fender)
Fender is an opinionated build system for front-end projects, built for [Webpack](https://webpack.github.io). It's a solid starting point for modern front-end web development.

Fender builds JavaScript modules for the browser (including a Babel preset for ES2015/React), processes SCSS using [LibSass](http://libsass.org) and automatically adds
vendor prefixes using [Autoprefixer](https://github.com/postcss/autoprefixer) & compacts media queries with [CSS MQPacker](https://github.com/hail2u/node-css-mqpacker).

It also supports [hot reloading](https://github.com/webpack/docs/wiki/hot-module-replacement-with-webpack) for CSS and React components.

## Usage
To get started, install [Webpack](https://webpack.github.io) and Fender in your project:
```sh
  npm install webpack webpack-dev-server fender --save-dev
```

Then, simply call Fender from your Webpack configuration:
```js
var pkg = require('./package.json');
var fender = require('fender');

module.exports = fender(pkg);
```

That's it! Optionally, set [overrides](https://github.com/DFurnes/fender/blob/master/webpack.config.example.js) for default settings. Then, simply run `grunt` to make development builds and watch for changes. When you're ready to push to production, use `grunt build` to make an optimized & minified build.

## License
&copy;2016 David Furnes. Fender is free software, and may be redistributed under the terms specified in the [LICENSE](https://github.com/DFurnes/fender/blob/master/LICENSE.md) file.
