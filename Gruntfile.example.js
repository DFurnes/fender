'use strict';

var fender = require('fender');

module.exports = function(grunt) {

  /**
   * Use fender for nice and easy Grunt configuration. Optionally, pass a
   * configuration object with overrides for default build settings.
   *
   * If using the default settings, the configuration object may be omitted!
   */
  fender(grunt, {
      // Scripts may be configured here, as a key-value pair of bundle name & file.
      // Defaults to building `<package name>` from `./src/<package name>.js`.
      bundles: {
          'custom_output_file.js': './src/custom_input_file.js'
      },

      // Any `*.scss` files required from script bundles will be packaged into a
      // separate style bundle named `<package_name>.css`. That name can optionally
      // be overridden here.
      styleBundle: 'custom_style_output.css',

      // Output directory for compiled stylesheets, scripts, and assets
      output: 'dist/',

      // Plugin options:
      options: {
          // Default autoprefixer browser support
          autoprefixer: ['last 4 versions', 'Firefox ESR', 'Opera 12.1'],

          // Default Babel transpiler options
          babel: {optional: 'es7.classProperties'}
      }
  });


};

