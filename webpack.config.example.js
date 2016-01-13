'use strict';

var pkg = require('./package.json');
var fender = require('fender');

/**
 * Use fender for nice and easy Webpack configuration. Optionally, pass a
 * configuration object with overrides for default build settings.
 *
 * If using the default settings, the configuration object may be omitted!
 */
module.exports = fender(pkg, {
  // Bundles may be configured like so, as a key-value pair of bundle name & file.
  // Defaults to building `<package name>` from `./src/<package name>.js`:
  bundles: {
    'custom_output_file.js': './src/custom_input_file.js'
  },

  // Output directory for compiled stylesheets, scripts, and assets:
  output: 'dist/',

  // Plugin options:
  options: {
    // Default autoprefixer browser support
    autoprefixer: ['last 4 versions', 'Firefox ESR', 'Opera 12.1'],

    // Default Babel transpiler options
    babel: {
      optional: ['runtime', 'es7.classProperties']
    }
  }
});

