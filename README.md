# Fender [![NPM](https://img.shields.io/npm/v/fender.svg)](https://www.npmjs.com/package/fender)
Fender is an opinionated [Webpack](https://webpack.github.io) configuration for front-end projects. It's a solid starting point for modern front-end web development. It builds JavaScript modules for the browser (and includes a Babel preset for ES2015/React), processes SCSS using [LibSass](http://libsass.org), [Autoprefixer](https://github.com/postcss/autoprefixer) & and [CSS MQPacker](https://github.com/hail2u/node-css-mqpacker). It also includes loaders for assets like images & fonts, which will automatically inline data URLs when optimal.

Fender outputs a standard Webpack configuration object, so it can easily be extended & works anywhere Webpack does.

## Usage
To get started, install [Webpack](https://webpack.github.io) and Fender in your project:
```sh
  npm install webpack webpack-dev-server fender --save-dev
```

Then, simply call Fender from your Webpack configuration:
```js
var fender = require('fender');

module.exports = fender();
```

That's it! Optionally, set [overrides](https://github.com/DFurnes/fender/blob/master/webpack.config.example.js) for default settings. Then, simply run `webpack-dev-server` to make development builds and watch for changes. When you're ready to push to production, use `NODE_ENV=production webpack` to make an optimized & minified build.

## License
&copy;2016 David Furnes. Fender is free software, and may be redistributed under the terms specified in the [LICENSE](https://github.com/DFurnes/fender/blob/master/LICENSE.md) file.
