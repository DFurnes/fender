'use strict';

var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var fs = require('fs');
var _ = require('lodash');

module.exports = function(pkg, overrides) {
    overrides = overrides || {};

    // Read environment from current NODE_ENV
    var environment = process.env.NODE_ENV || 'development';

    // Default settings
    var defaultConfig = {
        output: 'dist/',
        bundles: { /* see below */ },
        autoprefixer: ['last 4 versions', 'Firefox ESR', 'Opera 12.1'],
    };

    // If package has a name, use that as default input/output bundle
    if(pkg.name) {
        defaultConfig.bundles[pkg.name] = ['./src/' + pkg.name + '.js'];
    }

    if(process.env.NODE_ENV !== 'production') {
        _.map(defaultConfig.bundles, function(source) {
            source.push('webpack-dev-server/client?http://0.0.0.0:8080');
        })
    }

    // Override defaults where necessary
    var options = _.defaults(overrides, defaultConfig);

    /**
     * Configure Webpack to build scripts, styles, and other assets.
     *
     * JavaScript files are processed by Babel to compile ES6/ES2015 into
     * vanilla ES5 which can be run natively in current browsers.
     *
     * We use Autoprefixer to automatically add vendor-prefixes for appropriate
     * browsers. We use CSS-MQPacker to concatenate all media queries at the
     * end of our built stylesheets.
     *
     * Assets required in scripts or stylesheets are processed by Webpack and either
     * copied to dist directory, or inlined if under ~8kb.
     */
    var webpackConfig = {
        entry: options.bundles,
        output: {
            path: options.output,
            publicPath: '/',
            filename: '[name].js'
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
                },
                {
                    test: /\.(png|jpg|eot|gif|woff|svg|ttf)$/,
                    loader: 'url-loader?limit=8192'
                },
                {
                    test: /\.json$/,
                    loader: 'json-loader'
                }
            ]
        },
        postcss: function() {
            return [
                require('autoprefixer')({
                    browsers: options.autoprefixer
                }),
                require('css-mqpacker')()
            ];
        },
        plugins: [
            // ...
        ]
    };

    // On production builds, minify & set production flags
    if(environment === 'production') {
        webpackConfig.module.loaders.push({
            test: /\.css$/,
            loader: ExtractTextPlugin.extract('css-loader?sourceMap!postcss-loader')
        });

        webpackConfig.module.loaders.push({
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract('css-loader?sourceMap!postcss-loader!sass-loader?sourceMap')
        });

        _.extend(webpackConfig, {
            plugins: [
                new ExtractTextPlugin('[name].css'),
                new webpack.optimize.UglifyJsPlugin({
                    compress: {
                        drop_console: true,
                        drop_debugger: true,
                        dead_code: true
                    }
                }),
            ]
        });
    }

    // In development, generate source maps & watch for changes.
    if(environment !== 'production') {
        // Modify first loader (JavaScript) to enable HMR... hackz.
        webpackConfig.module.loaders[0].query = {
            "plugins": [
                ["react-transform", {
                    "transforms": [{
                        "transform": "react-transform-hmr",
                        "imports": ["react"],
                        "locals": ["module"]
                    }]
                }]
            ]
        };

        webpackConfig.plugins.unshift(new webpack.HotModuleReplacementPlugin());

        webpackConfig.module.loaders.push({
            test: /\.css$/,
            loader: 'style-loader!css-loader?sourceMap!postcss-loader'
        });

        webpackConfig.module.loaders.push({
            test: /\.scss$/,
            loader: 'style-loader!css-loader?sourceMap!postcss-loader!sass-loader?sourceMap'
        });

        _.extend(webpackConfig, {
            devtool: '#inline-source-map',
            keepalive: true,
            watch: true,
            inline: true,
        });
    }

    // If an ESLint config is specified, add linter as pre-loader
    // @TODO: Allow for `.eslintrc` as well.
    if(pkg.eslintConfig) {
        _.extend(webpackConfig, {
            eslint: {
                reset: true,
                configFile: pkg.eslintConfig,
            },
            module: {
                preLoaders: [
                    {
                        test: /\.js$/,
                        loader: "eslint-loader",
                        exclude: /node_modules/
                    }
                ],
            },
        });
    }

    return webpackConfig;
};

