'use strict';

var webpack = require('webpack');
var _ = require('lodash');


module.exports = function(grunt, config) {
    // Temporarily switch to fender directory, so we can load Grunt plugins...
    var cwd = process.cwd();
    process.chdir(__dirname);
    require('load-grunt-tasks')(grunt);
    process.chdir(cwd);

    var pkg = grunt.file.readJSON('package.json');

    // Default settings
    var defaultConfig = {
        assets: ['assets/**/*'],
        stylesheetsDir: 'src/',
        stylesheets: ['<%= pkg.name %>.scss'],
        scriptsDir: 'src/',
        scripts: {},
        output: 'dist/',
        options: {
            autoprefixer: ['last 4 versions', 'Firefox ESR', 'Opera 12.1']
        }
    };

    defaultConfig.scripts[pkg.name] = './src/<%= pkg.name %>.js';

    // Override defaults where necessary
    config = _.defaults(defaultConfig, config);

    // Configure Grunt tasks
    grunt.initConfig({

        /**
         * Load settings from package.json.
         */
        pkg: pkg,

        /**
         * Clean the `dist/` folder between builds.
         */
        clean: {
            dist: [config.output]
        },

        /**
         * Copy assets into `dist/` directory.
         */
        copy: {
            assets: {
                files: [
                    {expand: true, src: [config.assets], dest: config.output}
                ]
            }
        },

        /**
         * Pre-process CSS with LibSass.
         */
        sass: {
            // On production builds, minify and remove comments.
            prod: {
                files: [{
                    expand: true,
                    cwd: config.stylesheetsDir,
                    src: config.stylesheets,
                    dest: config.output,
                    ext: '.css'
                }],
                options: {
                    outputStyle: 'compressed'
                }
            },

            // On development builds, include source maps & do not minify.
            debug: {
                files: [{
                    expand: true,
                    cwd: config.stylesheetsDir,
                    src: config.stylesheets,
                    dest: config.output,
                    ext: '.css'
                }],
                options: {
                    sourceMap: true
                }
            }
        },

        /**
         * Post-process CSS with PostCSS.
         *
         * We use Autoprefixer to automatically add vendor-prefixes for appropriate
         * browsers. We use CSS-MQPacker to concatenate all media queries at the
         * end of our built stylesheets.
         */
        postcss: {
            options: {
                processors: [
                    require('autoprefixer-core')({
                        browsers: config.options.autoprefixer
                    }),
                    require('css-mqpacker').postcss
                ]
            },

            // On production builds, omit source maps.
            prod: {
                src: [config.output + '*.css'],
                options: {
                    map: false
                }
            },

            // On development builds, include source maps.
            debug: {
                src: [config.output + '*.css']
            }
        },

        /**
         * Build JavaScript with Webpack.
         */
        webpack: {
            options: {
                entry: config.scripts,
                output: {
                    path: config.output,
                    filename: "[name].js"
                },
                resolveLoader: {
                    modulesDirectories: ['node_modules/fender/node_modules']
                },
                module: {
                    loaders: [
                        { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}
                    ]
                }
            },

            // On production builds, minify & set production flags
            prod: {
                plugins: [
                    new webpack.DefinePlugin({
                        DEBUG: false,
                        PRODUCTION: true
                    }),
                    new webpack.optimize.UglifyJsPlugin({
                        compress: {
                            drop_console: true,
                            drop_debugger: true,
                            dead_code: true
                        }
                    })
                ]
            },

            // On development builds, generate source maps & set debug flags
            debug: {
                devtool: '#inline-source-map',
                plugins: [
                    new webpack.DefinePlugin({
                        DEBUG: true,
                        PRODUCTION: false
                    })
                ]
            }
        },

        /**
         * Watch files for changes, and trigger relevant tasks.
         */
        watch: {
            sass: {
                files: config.stylesheetsDir + '**/*.scss',
                tasks: ["sass:debug", "postcss:debug"]
            },
            js: {
                files: config.scriptsDir + '**/*.js',
                tasks: ["webpack:debug"]
            },
            assets: {
                files: config.assets,
                tasks: ["copy:assets"]
            }
        }
    });


    /**
     * Register Grunt aliases.
     */

    // > grunt
    // Build for development & watch for changes.
    grunt.registerTask('default', ['build:debug', 'watch']);

    // > grunt build
    // Build for production.
    grunt.registerTask('build', ['clean:dist', 'copy:assets', 'sass:prod', 'postcss:prod', 'webpack:prod']);

    // > grunt build:debug
    // Build for development.
    grunt.registerTask('build:debug', ['clean:dist', 'copy:assets', 'sass:debug', 'postcss:debug', 'webpack:debug']);

};

