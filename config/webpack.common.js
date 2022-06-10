const webpack = require('webpack')
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
require('dotenv').config().parsed
const envKeys = Object.keys(process.env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(process.env[next])
    return prev
}, {})

// para uso en local dejar vacio "/", para postear en Github pages usar '/Comunidad-dezzpo/'
const ASSET_PATH = process.env.ASSET_PATH || '/'
const isDevelopment = process.env.NODE_ENV !== 'production'

// @type {import('webpack').Configuration}

module.exports = {
    name: 'client',
    mode: isDevelopment ? 'development' : 'production',
    target: isDevelopment ? 'web' : 'browserslist',
    entry: ['./src/index.js'],
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].[contenthash].js',
        publicPath: '/', // '/Comunidad-dezzpo/'
    },
    resolve: {
        modules: ['node_modules'],
        extensions: ['.js', '.jsx', '.css', '.json'],
        alias: {},
        // Node.js polyfill for webpack v5+ : NodePolyfillPlugin
        // fallback: {
        //     url: require.resolve('url/'),
        //     buffer: require.resolve('buffer/'),
        //     util: require.resolve('util/'),
        //     https: require.resolve('https-browserify'),
        //     http: require.resolve('stream-http'),
        //     stream: require.resolve('stream-browserify'),
        //     crypto: require.resolve('crypto-browserify'),
        //     os: require.resolve('os-browserify/browser'),
        //     assert: require.resolve('assert/'),
        //     zlib: require.resolve('browserify-zlib'),
        // },
        fallback: {
            fs: false,
            tls: false,
            net: false,
            dns: false,
            http2: false,
            worker_threads: false,
            child_process: false,
            request: false,
            fast_crc32c: false,
            // path: false,
            // os: false,
            // crypto: false,
            // stream: false,
            // http: false,
            // zlib: false,
            // https: false,
        },
    },
    module: {
        rules: [
            {
                test: /\.[jt]s$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
            {
                // Loads the javacript into html template provided.
                // Entry point is set below in HtmlWebPackPlugin in Plugins
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                    },
                ],
            },
            {
                test: /\.styl$/,
                use: ['stylus-loader'],
            },
            {
                type: 'asset',
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                parser: {
                    dataUrlCondition: {
                        maxSize: 4 * 1024, // 4kb
                    },
                },
            },
            {
                test: /\.(woff(2)?|ttf|eot)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts/',
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new NodePolyfillPlugin(),
        // Esto nos permite utilizar de forma segura env vars en nuestro código
        new webpack.DefinePlugin({
            'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH),
        }),
        new webpack.DefinePlugin(envKeys),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            appMountId: 'app',
            template: path.resolve(__dirname, '/public/index.html'),
            filename: 'index.html',
            hash: true,
            templateParameters: {
                titulo: 'Comunidad Dezzpo',
                pith: 'Somos una..',
            },
        }),
    ],
}
