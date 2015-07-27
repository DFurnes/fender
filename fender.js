'use strict';

var webpack = require('webpack');
var _ = require('lodash');
var ExtractTextPlugin = require("extract-text-webpack-plugin");


module.exports = function(grunt, config) {

    // Load Fender's bundled Grunt plugins
    var cwd = process.cwd();
    process.chdir(__dirname);
    require('load-grunt-tasks')(grunt);
    process.chdir(cwd);

    var pkg = grunt.file.readJSON('package.json');

    // Default settings
    var defaultConfig = {
        output: 'dist/',
        assets: ['assets/**/*'],
        bundles: { /* see below */ },
        styleBundle: pkg.name + '.css',
        options: {
            autoprefixer: ['last 4 versions', 'Firefox ESR', 'Opera 12.1'],
            babel: {optional: 'es7.classProperties'}
        }
    };

    defaultConfig.bundles[pkg.name] = './src/<%= pkg.name %>.js';

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
         * Build JavaScript with Webpack.
         *
         * JavaScript files are processed by Babel to compile ES6 (and optionally ES7)
         * into ES5 which can be run natively in current browsers.
         *
         * We use Autoprefixer to automatically add vendor-prefixes for appropriate
         * browsers. We use CSS-MQPacker to concatenate all media queries at the
         * end of our built stylesheets.
         *
         * Assets required in scripts or stylesheets are processed by Webpack and either
         * copied to dist directory, or inlined if under ~8kb.
         */
        webpack: {
            options: {
                entry: config.bundles,
                output: {
                    path: config.output,
                    filename: "[name].js"
                },
                resolveLoader: {
                    modulesDirectories: ['node_modules/fender/node_modules']
                },
                module: {
                    loaders: [
                        {
                            test: /\.js$/,
                            exclude: /node_modules/,
                            loader: 'babel-loader',
                            query: config.options.babel
                        },
                        {
                            test: /\.scss$/,
                            loader: ExtractTextPlugin.extract('css-loader?sourceMap!postcss-loader!sass-loader?sourceMap')
                        },
                        {
                            test: /\.(png|jpg|eot|gif|woff|svg|ttf)$/,
                            loader: 'url-loader?limit=8192'
                        }
                    ]
                },
                postcss: function() {
                    return [
                        require('autoprefixer-core')({
                            browsers: config.options.autoprefixer
                        }),
                        require('css-mqpacker').postcss
                    ];
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
                    }),
                    new ExtractTextPlugin(config.styleBundle)
                ]
            },

            // In development, generate source maps & set debug flags
            dev: {
                devtool: '#inline-source-map',
                plugins: [
                    new webpack.DefinePlugin({
                        DEBUG: true,
                        PRODUCTION: false
                    }),
                    new ExtractTextPlugin(config.styleBundle)
                ],

                // Keep Webpack task running & watch for changes.
                keepalive: true,
                watch: true
            }
        }

    });


    /**
     * Register Grunt aliases.
     */

    // > grunt
    // Build for development & watch for changes.
    grunt.registerTask('default', ['clean:dist', 'webpack:dev']);

    // > grunt build
    // Build for production.
    grunt.registerTask('build', ['clean:dist', 'webpack:prod']);

};

