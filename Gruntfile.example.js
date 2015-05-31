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
      // Assets from the following paths will be copied into the output directory.
      assets: ['assets/**/*'],

      // SCSS directory & filenames may be configured here.
      stylesheetsDir: 'src/',
      stylesheets: ['<%= pkg.name %>.scss'],

      // Scripts may be configured here, as a key-value pair of bundle name & file.
      // Defaults to building `<package name>` from `./src/<package name>.js`.
      scripts: {
          '<%= pkg.name %>.js': './src/<%= pkg.name %>.js'
      },

      // Output directory for compiled stylesheets, scripts, and assets
      output: 'dist/',

      // Plugin options:
      options: {
          // Default autoprefixer browser support
          autoprefixer: ['last 4 versions', 'Firefox ESR', 'Opera 12.1']
      }
  });


};

