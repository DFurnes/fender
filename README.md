# Fender [![NPM](https://img.shields.io/npm/v/fender.svg)](https://www.npmjs.com/package/fender)
Fender is an opinionated build system for front-end projects. It processes SCSS
using [LibSass](http://libsass.org), automatically adds vendor prefixes using [Autoprefixer](https://github.com/postcss/autoprefixer)
& compacts media queries with [CSS MQPacker](https://github.com/hail2u/node-css-mqpacker), and compiles ES6 JavaScript using [Webpack](http://webpack.github.io)
and [Babel](https://babeljs.io).


## Usage
To get started, install Grunt and Fender in your project:
```sh
  npm install grunt fender --save-dev
```

Then, simply call Fender from your Gruntfile:
```js
'use strict';

var fender = require('fender');

module.exports = function(grunt) {

  /**
   * Use Fender for nice and easy builds.
   * @see http://npmjs.com/fender
   */
  fender(grunt);

};

```

That's it! Optionally, set [overrides](https://github.com/DFurnes/fender/blob/master/Gruntfile.example.js) for default settings. Then, simply run `grunt` to make development builds and watch for changes. When you're ready to push to production, use `grunt build` to make an optimized & minified build.

## License
&copy;2015 David Furnes. Fender is free software, and may be redistributed under the terms specified in the [LICENSE](https://github.com/DFurnes/fender/blob/master/LICENSE.md) file.
